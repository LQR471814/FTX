import argparse
import asyncio
import concurrent.futures
import json
import os
import platform
import socket
import struct
import subprocess
import sys
import threading
import time

import eel
import websockets



class App:
    def __init__(self, verbose: bool):
        self.verbose = verbose

        print("Starting...")

        #? Fetching Ip Address
        self.hostname = socket.gethostname()
        currentOS = platform.system()
        if platform.system() == "Windows":
            ip = socket.gethostbyname_ex(self.hostname)[-1]
            for address in ip:
                if "192.168" in address:
                    ip = address
        elif platform.system() == "Linux" or platform.system() == "Darwin":
            ip = subprocess.check_output("""ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'""", shell=True).decode("utf8").replace("\n", "")
        else:
            print("Platform Unsupported!")
            sys.exit(0)

        self.MULTICAST_GROUP = ('224.0.2.20', 50001)
        MULTICAST_TTL = 2

        #? Initializing Send Multicast Socket
        self.SendMCastSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        self.SendMCastSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.SendMCastSocket.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF, socket.inet_aton(ip))
        self.SendMCastSocket.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 32)

        #? Initializing Receive Multicast Socket
        self.ReceiveMCastSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        self.ReceiveMCastSock.bind(("", self.MULTICAST_GROUP[1]))
        group = socket.inet_aton(self.MULTICAST_GROUP[0])
        mreq = struct.pack("4sL", group, socket.INADDR_ANY)
        self.ReceiveMCastSock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)

        #? Event Loops
        self.userUpdateEventLoop = asyncio.new_event_loop()
        self.resourceEventLoop = asyncio.new_event_loop()

        #? Websocket Thread Daemons
        self.userUpdateThread = threading.Thread(target=self.userUpdateDaemon) #* To update user discovery
        self.userUpdateThread.start()

        self.resourceThread = threading.Thread(target=self.resourceDaemon) #* When frontend requires a resource that it cannot access
        self.resourceThread.start()

    def start(self):
        eel.init('build')
        eel.start('index.html', port=3000, host="localhost", close_callback=self.handle_exit, mode="chrome", block=True)

    @eel.expose
    def handle_exit(self, ar1, ar2):
        print("Quitting...")
        # self.ReceiveMCastSock.shutdown(socket.SHUT_RDWR)
        self.userUpdateEventLoop.call_soon_threadsafe(self.userUpdateEventLoop.stop)
        self.resourceEventLoop.call_soon_threadsafe(self.resourceEventLoop.stop)
        # self.userUpdateThread.join()
        # self.resourceThread.join()
        sys.exit(0)

    def userUpdateDaemon(self):
        asyncio.set_event_loop(self.userUpdateEventLoop)
        start_server = websockets.serve(self.UpdateUsers, "localhost", 4001)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

    def resourceDaemon(self):
        asyncio.set_event_loop(self.resourceEventLoop)
        start_server = websockets.serve(self.resource, "localhost", 4000)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

    async def resource(self, websocket, path):
        while True:
            try:
                request = await websocket.recv()
                request = json.loads(request)
            except:
                return
            print(request)
            switch = {
                "getInterfaces": self.getInterfaces,
                "setInterfaces": self.setInterfaces,
                "getOS": self.getOS,
                "getHostname": self.getHostname,
                "requireSetupWin": self.requireSetupWin
            }
            await websocket.send(json.dumps({"type":request["name"],"response":switch[request["name"]](request["parameters"])}))

    async def UpdateUsers(self, websocket, path):
        try:
            await websocket.recv()
        except:
            return
        self.SendMCastSocket.sendto((0).to_bytes(1, 'big') + self.hostname.encode("utf8"), self.MULTICAST_GROUP)
        while True:
            msgBytes, address = await asyncio.get_event_loop().run_in_executor(self.executor, self.ReceiveMCastSock.recvfrom, 1024)
            # msgBytes, address = self.ReceiveMCastSock.recvfrom(1024)
            messageType = msgBytes[0]
            if messageType == 0:
                deviceName = msgBytes[1:].decode('utf8')
                print(msgBytes, address)
                await websocket.send(json.dumps({"type":"addUser", "user":{"name":deviceName, "ip":address[0]}}))

    def requireSetupWin(self, parameters):
        required = True

        output = subprocess.check_output("""powershell.exe Get-NetRoute""", shell=True).decode("utf8")
        lines = []
        for line in output.split('\r\n'):
            if "224.0.0.0" in line:
                lines.append(line)

        for i in range(len(lines)):
            if lines[i].split()[3] != '256':
                required = False #? Should not display SetupBanner

        try:
            subprocess.check_output("""powershell.exe Get-NetFirewallRule -DisplayName \"FTX\"""")
            required = False
        except Exception as err:
            print(err)
            required = True

        return required #? Should display SetupBanner

    def setInterfaces(self, parameters):
        try:
            fileExtender = "exe"
            if self.verbose == True:
                fileExtender = "py"
                print(os.path.dirname(os.path.abspath(__file__)) + "\\" + "SetupMulticastWin.exe -i " + str(parameters["interfaceID"]) + " -p " + os.path.dirname(os.path.abspath(__file__)) + "\\" + "ftx." + fileExtender)
            return subprocess.check_output(os.path.dirname(os.path.abspath(__file__)) + "\\" + "SetupMulticastWin.exe -i " + str(parameters["interfaceID"]) + " -p " + os.path.dirname(os.path.abspath(__file__)) + "\\" + "ftx." + fileExtender).decode("utf8")
        except Exception as err:
            return str(err)

    def getInterfaces(self, parameters):
        output = subprocess.check_output("""netsh interface ipv4 show joins""", shell=True).decode("utf8")
        interfaces = [line for line in output.split('\n') if "Interface" in line]
        for line, i in zip(interfaces, range(len(interfaces))):
            resultLine = line.split(": ")
            resultLine[0] = int(resultLine[0].replace("Interface ", ""))
            interfaces[i] = {"id":resultLine[0], "name":resultLine[1]}
        return json.dumps(interfaces)

    def getOS(self, parameters):
        return platform.system()

    def getHostname(self, parameters):
        return socket.gethostname()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='FTX CLI Options')
    parser.add_argument("-v", "--verbose", required=False, help="Enable debug mode (If you are running this program directly from the script)", action="store_true")
    args = parser.parse_args()

    app = App(args.verbose)
    app.start()
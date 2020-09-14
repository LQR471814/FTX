import asyncio
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

@eel.expose
def handle_exit(ar1, ar2):
    print("Quitting...")
    sys.exit(0)

def userUpdateDaemon():
    asyncio.set_event_loop(userUpdateEventLoop)
    start_server = websockets.serve(UpdateUsers, "localhost", 4001)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

def resourceDaemon():
    asyncio.set_event_loop(resourceEventLoop)
    start_server = websockets.serve(resource, "localhost", 4000)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

async def resource(websocket, path):
    while True:
        try:
            request = await websocket.recv()
            request = json.loads(request)
        except:
            return
        print(request)
        switch = {
            "getInterfaces": getInterfaces,
            "setInterfaces": setInterfaces,
            "getOS": getOS,
            "getHostname": getHostname,
            "requireSetupWin": requireSetupWin
        }
        await websocket.send(json.dumps({"type":request["name"],"response":switch[request["name"]](request["parameters"])}))

def requireSetupWin(parameters):
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
    
def setInterfaces(parameters):
    try:
        print(os.path.dirname(os.path.abspath(__file__)) + "\\" + "SetupMulticastWin.exe -i " + str(parameters["interfaceID"]) + " -p " + os.path.dirname(os.path.abspath(__file__)) + "\\" + "ftx.exe")
        return subprocess.check_output(os.path.dirname(os.path.abspath(__file__)) + "\\" + "SetupMulticastWin.exe -i " + str(parameters["interfaceID"]) + " -p " + os.path.dirname(os.path.abspath(__file__)) + "\\" + "ftx.exe").decode("utf8")
    except Exception as err:
        return str(err)

def getInterfaces(parameters):
    output = subprocess.check_output("""netsh interface ipv4 show joins""", shell=True).decode("utf8")
    interfaces = [line for line in output.split('\n') if "Interface" in line]
    for line, i in zip(interfaces, range(len(interfaces))):
        resultLine = line.split(": ")
        resultLine[0] = int(resultLine[0].replace("Interface ", ""))
        interfaces[i] = {"id":resultLine[0], "name":resultLine[1]}
    return json.dumps(interfaces)

def getOS(parameters):
    return platform.system()

def getHostname(parameters):
    return socket.gethostname()

async def UpdateUsers(websocket, path):
    try:
        await websocket.recv()
    except:
        return
    SendMCastSocket.sendto((0).to_bytes(1, 'big') + hostname.encode("utf8"), MULTICAST_GROUP)
    while True:
        msgBytes, address = ReceiveMCastSock.recvfrom(1024)
        print(msgBytes, address)
        messageType = msgBytes[0]
        if messageType == 0:
            deviceName = msgBytes[1:].decode('utf8')
            await websocket.send(json.dumps({"type":"addUser", "user":{"name":deviceName, "ip":address[0]}}))

if __name__ == "__main__":
    try:
        print("Starting...")

        #? Fetching Ip Address
        hostname = socket.gethostname()
        currentOS = platform.system()
        if platform.system() == "Windows":
            ip = socket.gethostbyname_ex(hostname)[-1]
            for address in ip:
                if "192.168" in address:
                    ip = address
        elif platform.system() == "Linux" or platform.system() == "Darwin":
            ip = subprocess.check_output("""ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'""", shell=True).decode("utf8").replace("\n", "")
        else:
            print("Platform Unsupported!")
            sys.exit(0)

        MULTICAST_GROUP = ('224.0.2.20', 50001)
        MULTICAST_TTL = 2

        #? Initializing Send Multicast Socket
        SendMCastSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        SendMCastSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        SendMCastSocket.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF, socket.inet_aton(ip))
        SendMCastSocket.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 32)

        #? Initializing Receive Multicast Socket
        ReceiveMCastSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        ReceiveMCastSock.bind(("", MULTICAST_GROUP[1]))
        group = socket.inet_aton(MULTICAST_GROUP[0])
        mreq = struct.pack("4sL", group, socket.INADDR_ANY)
        ReceiveMCastSock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

        #? Event Loops
        userUpdateEventLoop = asyncio.new_event_loop()
        resourceEventLoop = asyncio.new_event_loop()
        actionEventLoop = asyncio.new_event_loop()

        #? Websocket Thread Daemons
        userUpdateThread = threading.Thread(target=userUpdateDaemon, daemon=True) #* To update user discovery
        userUpdateThread.start()

        resourceThread = threading.Thread(target=resourceDaemon, daemon=True) #* When frontend requires a resource that it cannot access
        resourceThread.start()

        eel.init('build')
        eel.start('index.html', port=3000, host="localhost", close_callback=handle_exit, mode="chrome", block=True)
    except Exception as err:
        print(err)

import asyncio
import platform
import socket
import struct
import subprocess
import sys
import threading
import time
import json

import eel
import websockets


@eel.expose
def handle_exit(ar1, ar2):
    print("Quitting...")
    sys.exit(0)

def receiveMCastThread(recvSocket):
    while True:
        msgBytes = ReceiveMCastSock.recv(1024)
        print(msgBytes)

async def UserUpdate(websocket, path):
    while True:
        try:
            await websocket.send(json.dumps({"type":"addUser", "user":{"name":"test", "ip":"127.0.0.1"}}))
        except:
            asyncio.get_event_loop().stop()
        await asyncio.sleep(3)

if __name__ == "__main__":
    try:
        print("Getting things ready...")

        #? Fetching Ip Address
        hostname = socket.gethostname()
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

        receiveThread = threading.Thread(target=receiveMCastThread, kwargs={"recvSocket":ReceiveMCastSock}, daemon=True)
        receiveThread.start()

        SendMCastSocket.sendto((0).to_bytes(1, 'big') + socket.gethostname().encode("utf8"), MULTICAST_GROUP)

        eel.init('build')
        eel.start('index.html', port=3000, host="localhost", close_callback=handle_exit, mode="chrome", block=False)
        
        eel.sleep(1)

        start_server = websockets.serve(UserUpdate, "localhost", 4000)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except Exception as err:
        print(err)


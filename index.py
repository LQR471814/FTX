import platform
import socket
import struct
import subprocess
import sys
import threading

import eel


@eel.expose
def handle_exit(ar1, ar2):
    print("Quitting...")
    sys.exit(0)

def receiveMCastThread(recvSocket):
    while True:
        msgBytes = ReceiveMCastSock.recv(1024)
        print(msgBytes)

if __name__ == "__main__":
    print("Getting things ready...")

    class PlatformUnsupported(Error):
        pass

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
        raise PlatformUnsupported

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

    eel.init('build')
    eel.start('index.html', port=3000, host="localhost", close_callback=handle_exit, mode="chrome", block=False)

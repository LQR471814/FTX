import ctypes, sys
import subprocess
import argparse

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def main():
    try:
        parser = argparse.ArgumentParser(description='A mini executable to set interface')
        parser.add_argument("-i", "--interface", required=True, help="Interface ID, ex. 20")
        parser.add_argument("-p", "--path", required=True, help="Main file path ex. C:\\Users\\...")
        args = parser.parse_args()
        print(subprocess.check_output(f"""netsh interface ipv4 set route 224.0.0.0/4 interface={args.interface} siteprefixlength=0 metric=1 publish=yes store=persistent""").decode("utf8"))
        print(subprocess.check_output(f"""netsh advfirewall firewall add rule name="FTX" program="{args.path}" protocol=udp dir=in enable=yes action=allow profile=Any""").decode("utf8"))
    except Exception as err:
        print(err)
    input("[ENTER]")
    
if is_admin():
    main()
else:
    ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv[1:]), None, 1)

import ctypes, sys
import subprocess
import argparse

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def main():
    parser = argparse.ArgumentParser(description='A mini executable to set interface')
    parser.add_argument("-i", "--interface", required=True, help="Interface ID, ex. 20")
    args = parser.parse_args()
    print(subprocess.check_output(f"""netsh interface ipv4 set route 224.0.0.0/4 interface={args.interface} siteprefixlength=0 metric=1 publish=yes store=persistent""").decode("utf8"))
    
if is_admin():
    main()
else:
    ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv[1:]), None, 1)

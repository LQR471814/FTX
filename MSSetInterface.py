import subprocess
import argparse
from elevate import elevate
elevate(show_console=False)
parser = argparse.ArgumentParser(description='A mini executable to set interface')
parser.add_argument("-i", "--interface", required=True, help="Interface ID, ex. 20")
args = parser.parse_args()
print(subprocess.check_output(f"""netsh interface ipv4 set route 224.0.0.0/4 interface={args.interface} siteprefixlength=0 metric=1 publish=yes store=persistent"""))
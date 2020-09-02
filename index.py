import eel
import sys

@eel.expose
def hello():
    print('hello')

eel.init('build')

@eel.expose
def handle_exit(ar1, ar2):
    print("Quitting...")
    sys.exit(0)
 
if __name__ == "__main__":
    eel.start('index.html', port=3000, host="localhost", close_callback=handle_exit, mode="chrome")
## Client State

| Events           | 0 - Initial | 1 - Connecting | 2 - Waiting for Confirmation | 3 - Waiting for Upload Complete Confirmation |
|------------------|:-----------:|:--------------:|:----------------------------:|:--------------------------------------------:|
| start            |    opw/1    |        -       |               -              |                       -                      |
| onopen           |      -      |      srq/2     |               -              |                       -                      |
| onacceptrequest  |      -      |        -       |        ssu, upl/3            |                       -                      |
| ondenyrequest    |      -      |        -       |             qui/0            |                       -                      |
| onuploadcomplete |      -      |        -       |               -              |    inc, if (true) -> upl/3; else -> qui/0    |

```text
opw : open websocket connection
srq : send files request
ssu : send start upload file signal
upl : upload file at current index
inc : increment current file index (return false out of range)
qui : close connection and quit
```

## Server State

| Events                  | 0 - Initial | 1 - Waiting for File Requests | 2 - Waiting for User Confirmation | 3 - Waiting for Start Upload Signal | 4 - Waiting for All File Contents |
|-------------------------|:-----------:|:-----------------------------:|:---------------------------------:|:-----------------------------------:|:---------------------------------:|
| onpeerconnect           |      1      |               -               |                 -                 |                  -                  |                 -                 |
| onrecvrequests          |      -      |             dsr/2             |                 -                 |                  -                  |                 -                 |
| onuseraccept            |      -      |               -               |               sca/3               |                  -                  |                 -                 |
| onuserdeny              |      -      |               -               |               scd/0               |                  -                  |                 -                 |
| onrecvstartuploadsignal |      -      |               -               |                 -                 |                  4                  |                 -                 |
| onrecvallfilecontents   |      -      |               -               |                 -                 |                  -                  |             tsc, sfc/3            |
| onpeerdisconnect        |    der/0    |             der/0             |               der/0               |                  0                  |               der/0               |

```text
dsr : display file send requests to user
sca : send client allow
scd : send client deny
tsc : store file contents and update gui
sfc : send client file upload complete
der : throw unexpected disconnect error
```

## Client State

| Events             | 0 - Initial | 1 - Connecting | 2 - Waiting for Confirmation | 3 - Waiting for Upload Complete Confirmation |
|--------------------|:-----------:|:--------------:|:----------------------------:|:--------------------------------------------:|
| start              |    opw/1    |        -       |               -              |                       -                      |
| onopen             |      -      |      srq/2     |               -              |                       -                      |
| onacceptrequest    |      -      |        -       |          ssu, upl/3          |                       -                      |
| ondenyrequest      |      -      |        -       |             qui/0            |                       -                      |
| onrecvuploadstatus |      -      |        -       |               -              |                      swu                     |
| onuploadcomplete   |      -      |        -       |               -              |    inc, if (true) -> upl/3; else -> qui/0    |

```text
opw : open websocket connection
srq : send files request
ssu : send start upload file signal
upl : upload file at current index
swu : show current upload percent
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
| onrecvstartuploadsignal |      -      |               -               |                 -                 |                bfw, 4               |                 -                 |
| onrecvfilecontents      |      -      |               -               |                 -                 |                  -                  |                sgd                |
| onrecvuploadstatus      |      -      |               -               |                 -                 |                  -                  |                rfs                |
| onrecvallfilecontents   |      -      |               -               |                 -                 |                  -                  |               upd/3               |
| onpeerdisconnect        |    der/0    |             der/0             |               der/0               |                  0                  |               der/0               |

```text
dsr : display file send requests to user
sca : send client allow
scd : send client deny
upd : update gui
bfw : start file writer goroutine
rfs : reply with file status
sgd : send file chunk to goroutine to be written to buffer
der : throw unexpected disconnect error
```

## Server File Writer Goroutine State

| Events         | 0 - Initial | 1 - Waiting for file data |
|----------------|-------------|---------------------------|
| oninit         | crf, ibf/1  | -                         |
| onrecvfiledata | -           | wrb/1                     |
| onfileallrecv  | -           | cll, clo/0                |

```text
crf : create file
ibf : initialize buffer
sfc : send client file upload complete
wrb : write to buffer
cll : call onfinish callback with filename
clo : flush buffer and close file
```

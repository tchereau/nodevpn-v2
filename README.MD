#nodevpn v2

if error ```no such file or directory, open '/dev/net/tun'```

```bash
mkdir -p /dev/net
mknod /dev/net/tun c 10 200
chmod 600 /dev/net/tun
```

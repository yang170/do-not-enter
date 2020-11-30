KERNEL = /lib/modules/$(shell uname -r)/build
obj-m += netfilter_drop_packet.o

all:
	${MAKE} -C ${KERNEL} M=$(PWD) modules

clean:
	${MAKE} -C ${KERNEL} M=$(PWD) clean


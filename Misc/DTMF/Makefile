EXE		= dtmf2num
CFLAGS	+= -O2 -s
PREFIX	= /usr/local
BINDIR	= $(PREFIX)/bin
LIBS	= -lm

all:
	$(CC) $(CFLAGS) -c dtmf2num.c
	$(CC) $(CFLAGS) -c dsp.c
	$(CC) $(CFLAGS) -c resample2.c
	$(CC) $(CFLAGS) -o $(EXE) $(LIBS) dtmf2num.o dsp.o resample2.o

install:
	install -m 755 -d $(BINDIR)
	install -m 755 $(EXE) $(BINDIR)/$(EXE)

.PHONY:
	install

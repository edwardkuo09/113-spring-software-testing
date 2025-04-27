#include <string.h>
#include <stdio.h>

void antiasan(unsigned long addr)
{
	// printf(" %p\n",(void *)((addr - 0x100)>>3));
	// printf(" %p\n",(void *)(((addr - 0x100)>>3)+0x7fff8000));
	// shift to shadow mem in AddressSanitizer
	unsigned char *s = (unsigned char*)(((addr)>>3)+0x7fff8000);
	unsigned char *e = (unsigned char*)(((addr+0x100) >> 3) + 0x7fff8000);

	while(s < e) *s++ = 0;
}

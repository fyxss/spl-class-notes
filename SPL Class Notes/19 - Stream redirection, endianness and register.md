---
tags: [spl, c-programming, file-io, memory, storage]
---

# 19 — Stream redirection, endianness and `register`

Date: 14.09.2026.

## `freopen`

`freopen` associates an existing stream with another file:

```c
pt = freopen("test2.ini", "r+", pt);
```

Here `pt` must already refer to a valid open stream. Check the returned pointer before further use.

The standard streams are available through `<stdio.h>`:

- `stdin`: used by `scanf`.
- `stdout`: used by `printf`.

Redirect them to files to use the same input/output statements during local testing:

```c
#include <stdio.h>

int main(void) {
    if (freopen("in.txt", "r", stdin) == NULL) return 1;
    if (freopen("out.txt", "w", stdout) == NULL) return 1;

    int n;
    if (scanf("%d", &n) == 1)
        printf("%d\n", n);
    return 0;
}
```

Now `scanf` reads from `in.txt` and `printf` writes to `out.txt`.

## Byte order: big endian and little endian

For the hexadecimal value `0x01020304`, assume it occupies four bytes, with consecutive byte addresses beginning at 100:

| Byte address | 100 | 101 | 102 | 103 |
|---|---|---|---|---|
| Big endian | `01` | `02` | `03` | `04` |
| Little endian | `04` | `03` | `02` | `01` |

- **Big endian:** most significant byte at the lowest address.
- **Little endian:** least significant byte at the lowest address.

The numeric value remains `0x01020304`; byte order describes its memory representation. Consecutive bytes have consecutive addresses.

Inspect the first byte through a character pointer:

```c
unsigned int a = 0x01020304u;
unsigned char first = *(unsigned char *)&a;
```

For a four-byte `unsigned int` with eight-bit bytes, `first` is `0x01` on a big-endian machine and `0x04` on a little-endian machine.

## Storage class: `register`

The processor communicates with memory and I/O. Registers are small storage locations in the processor used during computation.

```c
register int a, b;
```

`register` suggests fast access to an automatic variable. The compiler may ignore the suggestion; it does not guarantee placement in a CPU register.

> [!note] Pointer clarification
> In C11 and C17, taking the address of a variable declared `register` is not allowed. A pointer variable itself can be declared `register`: `register int *p;` is valid. The restriction is on `&p`, not on using `p` to hold another object's address.

Next: [[20 - Bitwise operations and masking]].

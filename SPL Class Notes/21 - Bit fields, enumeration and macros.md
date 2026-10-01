---
tags: [spl, c-programming, bit-fields, enum, preprocessor]
---

# 21 — Bit fields, enumeration and macros

Date: 15.09.2026.

## Bit fields

A nibble is 4 bits. For the examples below, assume a word is 2 bytes and an `int` is 32 bits. Machine word sizes and integer sizes vary.

If a value only ranges from 0 to 100, seven bits are sufficient: an unsigned seven-bit value represents 0 through 127. **Bit fields** specify widths for structure members:

```c
struct field {
    unsigned a : 7;
    unsigned b : 4;
    unsigned   : 5; // unnamed: reserved bits
    unsigned c : 6;
};

// Inside main:
// struct field var = {0};
// var.a = 100;
// var.b = 9;
// var.c = 32;
// printf("%zu\n", sizeof var);
```

Access named fields as `var.a`, `var.b`, and `var.c`. The unnamed five-bit field occupies space but cannot be accessed by name.

```c
unsigned : 0;
```

An unnamed zero-width field forces the following bit field to a new allocation-unit boundary.

> [!note] Bit-field size
> With 16-bit allocation units, `7 + 4 + 5` bits fit in one unit and the six-bit `c` goes in the next, giving two units or 4 bytes under that model. The actual allocation unit, packing order, alignment, and structure size depend on the implementation. Use `sizeof` on the actual compiler.

## Enumeration

Instead of remembering color codes such as `foreground = 4` and `background = 2`, give the codes names:

```c
enum color {
    black, white, blue, orange, green, yellow
};

enum color foreground = green; // 4
enum color background = blue;  // 2
```

The first enumerator defaults to 0; each following unspecified value is one greater than the previous value.

```text
black  white  blue  orange  green  yellow
  0      1      2      3      4      5
```

If `white = -1` is explicitly assigned, the next values become `blue = 0`, `orange = 1`, and so on. Enumerators are used directly, such as `green`, not as `var.green`.

## Argument count and argument array

Command-line arguments use this form of `main`:

```c
int main(int argc, char *argv[]) {
    return 0;
}
```

`argc` is the argument count; `argv` is an array of pointers to argument strings. When available, `argv[0]` identifies the program, and the remaining entries hold command-line arguments. This is different from the `...` variable-argument functions developed in [[23 - Variable length arguments]].

For a varying number of same-type values, an array and count also work:

```c
int calc(int count, const int ar[]) {
    int sum = 0;
    for (int i = 0; i < count; ++i) sum += ar[i];
    return sum;
}

// int ar[] = {5, 2, 6};
// calc(1, ar); // 5
// calc(3, ar); // 13
```

An ordinary integer array cannot hold arbitrary mixed types such as an integer, a double, and a string.

## Object-like macros

`#define` substitutes text before compilation. This area expression uses `b` and `h` already in scope:

```c
#define area (0.5 * (b) * (h))

// Inside main:
// double b = 4, h = 3;
// printf("%f\n", area); // 6.000000
```

Use floating-point variables with this `%f` example. A macro is not an ordinary variable or function.

## Multiline macros and line continuation

A backslash immediately before the physical newline continues the definition:

```c
#define loop for (int i = 0; i < n; ++i) \
                 sum += i;

// int n = 5, sum = 0;
// loop
// sum is now 10
```

A backslash-newline also joins physical source lines. It does not print a newline; `\n` inside a string does that. For readable split text, adjacent string literals can be used:

```c
printf("Hello "
       "World");
```

## Function-like macros

An `add` function can be written as:

```c
int add(int a, int b) {
    return a + b;
}
```

In a separate example, the macro form is:

```c
#define add(a, b) ((a) + (b))
// add(5, 6) expands to ((5) + (6))
```

Parenthesize arguments and the full expression so larger expressions keep the intended precedence. Do not define the macro before the function definition with the same name.

## Bit-checking macros

```c
#include <limits.h>

#define ckbit(a, i) ((a) & (1u << (i)))
#define setbit(a, i) ((a) | (1u << (i)))

// unsigned a = 5u;
// unsigned nbits = sizeof a * CHAR_BIT;
// for (unsigned i = 0; i < nbits; ++i)
//     printf("%u", ckbit(a, i) != 0);
// a = setbit(a, 1); // a becomes 7
```

`sizeof a` gives bytes, so multiply by bits per byte (`CHAR_BIT`, usually 8). Valid bit indices run from 0 to `nbits - 1`. `ckbit` returns a mask value; compare it with 0 when a 0/1 answer is needed. `setbit` computes the changed value, so assign it back.

Next: [[22 - Bit-packed sieve and light control]].

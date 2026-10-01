---
tags: [spl, c-programming, functions]
---

# 01 — Program quality and functions

## Characteristics of a good program

A good program has six main qualities:

1. **Integrity:** a calculation should be correct and dependable.
2. **Clarity:** the code should communicate its intent. Choose readable names, for example `myAge` (camel case) or `my_age` (snake case), instead of unclear names.
3. **Simplicity:** expressions and statements should be easy to understand.
4. **Efficiency:** consider both execution time and memory use.
5. **Modularity:** split a large task into smaller functions/modules.
6. **Generality:** write a solution that works for a useful range of inputs, not just one example.

Modularity makes code easier to write, test, debug, and read. Binary search takes O(log n) comparisons on **sorted** data; linear search takes O(n) comparisons in the worst case and works without sorting.

### Clarity guidelines

The class notes emphasize 8 practical rules to ensure code clarity and readability:

1. **Avoid overly long statements:** Do not cram complex operations into a single line; break them into readable steps.
2. **Use meaningful variable names:** Choose readable conventions, such as `camelCase` (`myAge`) or `snake_case` (`my_age`), rather than cryptic single letters.
3. **Proper indentation:** Keep blocks consistently indented inside `if`/`else`, `switch`, and loop bodies.
4. **Clean control flow:** Use `break` and guard conditions; avoid redundant or deeply nested `else` blocks when an early exit suffices.
5. **Explicit parentheses:** Use parentheses to make expression grouping unambiguous (for example, `((a / b) * c) + d` instead of relying on subtle operator precedence).
6. **Consistent spacing:** Add spaces around binary operators and after commas to keep expressions visually clean.
7. **Limit nesting depth:** Avoid nesting loops and conditionals deeper than **3 layers**.
8. **Use modular functions:** Decompose large tasks into focused helper functions to keep logic manageable.

Parentheses make expressions straightforward to follow without guessing operator precedence.

> [!note] Efficiency language
> A single arithmetic or conditional operation is often modeled as **O(1)** time and O(1) extra space. This is a model, not a measurement of actual elapsed time.

## Functions and modularity

A **function** is a self-contained block of code that performs a specific task. It is defined once and called whenever needed.

### Advantages of using functions
- **Avoid repetition:** Write once and reuse code across the program.
- **Easier debugging and testing:** Isolate errors to a single modular unit.
- **Improved readability:** Express high-level logic cleanly without clutter.
- **Modular design:** Break down large problems into manageable sub-problems.
- **Team-friendly:** Multiple developers can work on separate functions simultaneously.

```c
return_type function_name(parameter_list) {
    // function body
    return expression;  // only for a non-void return type
}
```

### Declaration and definition

```c
int add(int a, int b);          // declaration and prototype

int add(int a, int b) {         // definition
    return a + b;
}
```

A **declaration** informs the compiler that a function exists. A **prototype** is a specific kind of declaration that specifies the return type and parameter types, enabling the compiler to validate argument types and counts at call sites. A **definition** provides the actual body.

> [!note] Declarations versus Prototypes
> *"All prototypes are declarations, but not all declarations are prototypes."*
> In older C (prior to C23), `int add();` is a declaration but not a prototype because it does not specify parameter types. Writing `int add(void);` is a prototype specifying that the function takes no arguments.

Parameter names may be omitted in a prototype:

```c
int max3(int, int, int);
int sum_array(const int[], int);
```

The names used in a definition may differ from the names in a prototype; the types must match.

### Four forms of user-defined functions

| Arguments? | Return value? | Example signature |
|---|---|---|
| No | No | `void show(void)` |
| Yes | No | `void show(int x)` |
| No | Yes | `int read_value(void)` |
| Yes | Yes | `int add(int a, int b)` |

## Parameters and a maximum example

**Formal parameters** are the variables declared in the function's parameter list. **Actual arguments** are the values supplied in a call. For example, find the maximum of three numbers:

```c
int max3(int a, int b, int c) {
    int max = (a > b) ? a : b;
    return (max > c) ? max : c;
}

// Inside the calling function:
// int answer = max3(x, y, z);  // x, y, z are actual arguments
```

The same maximum can be written with a nested conditional operator:

```c
return a > b ? (a > c ? a : c) : (b > c ? b : c);
```

Use the form that makes the comparisons easiest to follow.

Next: [[02 - GCD, parameters and recursion]].

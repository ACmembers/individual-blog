---
title: 异或哈希（Zobrist Hashing）的核心定理与证明
published: 2026-05-26
description: Zobrist Hashing 碰撞概率的形式化证明——对于任意两个不相等的集合，其哈希碰撞概率为 1/2^k。
tags: [随机化]
category: 算法
---

假设我们有一个全集 $U$。

我们使用一个随机数发生器，为全集中的每一个元素 $x \in U$ 分配一个 $k$ 位的无符号随机整数，记作 $val(x)$。

在这个设定下，$val(x)$ 是在区间 $[0, 2^k - 1]$ 上的独立同分布均匀随机变量。

对于任意一个集合 $S \subseteq U$，我们定义其异或哈希值为集合内所有元素映射值的异或和：
$$H(S) = \bigoplus_{x \in S} val(x)$$

---

## 核心定理证明

**定理：** 对于任意两个不相等的集合 $S$ 和 $T$（即 $S \neq T$），它们的哈希值发生碰撞的概率为：
$$P(H(S) = H(T)) = \frac{1}{2^k}$$

**证明过程：**

### 第一步：转化为异或方程
假设 $S$ 和 $T$ 发生了哈希碰撞，即 $H(S) = H(T)$。

根据异或运算的性质（$A \oplus A = 0$），等式两边同时异或 $H(T)$，可以得到：
$$H(S) \oplus H(T) = 0$$

展开哈希函数：
$$\left( \bigoplus_{x \in S} val(x) \right) \oplus \left( \bigoplus_{y \in T} val(y) \right) = 0$$

### 第二步：引入对称差（Symmetric Difference）
如果一个元素 $e$ 同时属于 $S$ 和 $T$（即 $e \in S \cap T$），那么 $val(e)$ 在上面的式子中会出现两次。由于 $val(e) \oplus val(e) = 0$，这些公共元素的贡献全部抵消了。

留下的元素，正是那些"只在 $S$ 中出现而不在 $T$ 中出现"，或者"只在 $T$ 中出现而不在 $S$ 中出现"的元素。这在集合论中称为**对称差**，记为 $S \triangle T$。

因此，等式化简为：
$$\bigoplus_{z \in S \triangle T} val(z) = 0$$

### 第三步：概率的独立性分析（最绝妙的一步）
因为已知 $S \neq T$，所以它们的对称差绝不是空集（$S \triangle T \neq \emptyset$）。

既然不是空集，我们就可以从对称差中任意挑选出一个特定的元素，记作 $u$。

我们将等式拆开，把 $u$ 单独提出来：
$$val(u) \oplus \left( \bigoplus_{z \in S \triangle T, z \neq u} val(z) \right) = 0$$

等价变形为：
$$val(u) = \bigoplus_{z \in S \triangle T, z \neq u} val(z)$$

现在我们来审视这个等式：
* 等式右边是一堆除了 $u$ 以外的元素的随机值异或和。无论这个计算结果是多少，我们都可以将其视为一个确定的常数，记为 $C$。
* 等式左边是 $val(u)$。因为我们给每个元素分配随机数时是完全独立的，所以 $val(u)$ 的取值完全不受右边那些元素的影响。

$val(u)$ 是在 $[0, 2^k - 1]$ 中均匀随机生成的。它恰好等于那个特定常数 $C$ 的概率是多少？

显然，概率精确地等于：
$$P(val(u) = C) = \frac{1}{2^k}$$

**证明完毕。**

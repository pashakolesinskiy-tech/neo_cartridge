/*
 * Decompiled with CFR 0.152.
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.g;
import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class r {
    int[][][] a;
    int[] a;
    boolean[] a;
    boolean[] b;
    static int a = 0;
    static int[] b = new int[4];
    static int b = 2;
    static boolean a = true;
    int c;
    int d;
    int e;
    int f;
    int g;
    int h;
    int i;
    boolean b;
    int j;
    int k;
    int l;
    int m;
    int n;
    int o;
    int p;
    int q;
    int r;
    int s;
    int t;
    int u;
    int v;
    boolean c;
    public static int[] c = new int[8];
    int w;
    int x;
    boolean d;
    int y;
    int z;
    int A;
    int B;
    int C = 0;
    int D = 0;
    int E;
    int F;
    long a = new boolean[4];
    int G = 0;
    int H = 0;
    int I;
    int J;
    int K = 0;
    int L = 0;
    int M;
    int N;
    int O;
    int P;
    boolean e;
    public int Q;
    int R;
    int S;
    int T;
    boolean f;
    int U;
    int V;
    int W;
    int X;
    int Y = 0;
    int Z;
    int aa;
    int ab;
    int ac;
    int ad;
    int ae;
    int af;
    int ag;
    int ah = 0;
    boolean g = false;
    int ai;
    int aj;
    int ak;
    boolean h = false;
    int al = 0;
    int am = 0;
    int an;
    int ao;
    int ap;
    int aq;
    boolean i = false;
    boolean j = false;
    int ar;
    int as = 0;
    int at;
    int au;
    int av = 8;
    int aw;
    int ax;
    int ay;
    int az;
    int aA;
    int aB;
    int aC = 0;
    int aD = 32;
    int aE = 10;
    int aF = 256;
    int aG;
    int aH;
    int aI = 0;
    long b = 0L;
    long c = 0L;
    long d;
    long e;
    long f;
    int aJ;
    int aK;
    int[] d = new int[4];
    int[] e = new int[4];
    int aL;
    int aM;
    int aN;
    int aO;
    int aP;
    int aQ;
    int aR = 64;
    int aS;
    int aT;
    int[] f = new int[4];
    int aU;
    int aV;
    boolean k = false;
    boolean l = false;
    int aW = -1;
    int aX = -1;
    int aY;
    int aZ;
    int ba = 0;
    int bb = 0;
    int bc = 2;
    int bd;
    int be;
    int bf;
    int bg;
    int bh;
    boolean m;
    int bi;
    int bj;

    public final void a(int n2, int n3, int n4, int n5) {
        com.mnemonicstudios.novusapp.n.a(8);
        this.M = n5 * n5;
        this.P = (n5 + (n5 >> 1)) * (n5 + (n5 >> 1));
        this.G = 0;
        this.K = 0;
        while (this.G < this.aJ) {
            this.H = 0;
            while (this.H < this.aK) {
                if (this.H != this.am || this.G != this.al) {
                    this.N = (this.a[this.G][this.H][0] - n2) * (this.a[this.G][this.H][0] - n2) + (this.a[this.G][this.H][1] - n3) * (this.a[this.G][this.H][1] - n3);
                    if (this.N <= this.M) {
                        this.c = this.a[this.G][this.H][0] - n2;
                        if (n4 == 0 && this.c > 0 || n4 == 1 && this.c < 0) {
                            this.a[this.G][this.H][5] = this.a[this.G][this.H][0] < n2 ? -2 - com.mnemonicstudios.novusapp.n.a(4) : 2 + com.mnemonicstudios.novusapp.n.a(4);
                            this.a[this.G][this.H][6] = -12 - com.mnemonicstudios.novusapp.n.a(4);
                            this.a[this.G][this.H][9] = 4;
                            if (this.a[this.G][this.H][4] >= 0) {
                                this.L = (n5 >> 1) + com.mnemonicstudios.novusapp.n.a(5);
                                int[] nArray = this.a[this.G][this.H];
                                nArray[13] = nArray[13] - this.L;
                                if (this.a[this.G][this.H][13] > 100) {
                                    this.a[this.G][this.H][13] = 100 - com.mnemonicstudios.novusapp.n.a(5);
                                }
                                this.K = this.G != this.al ? (this.K += this.L) : (this.K -= this.L);
                            }
                            if (com.mnemonicstudios.novusapp.n.a(100) > 50) {
                                this.c(this.G, this.H, com.mnemonicstudios.novusapp.n.a(1));
                            }
                        }
                    }
                }
                ++this.H;
            }
            int n6 = this.G++;
            c[n6] = c[n6] + this.K * 94761;
        }
    }

    public final void b(int n2, int n3, int n4, int n5) {
        this.a[this.al][this.am][9] = 13;
        this.d = n2;
        this.e = n3;
        this.f = n4;
        this.g = n5;
        this.b = false;
        com.mnemonicstudios.novusapp.i.a(n2, n3);
    }

    public final void a(int n2, int n3, int n4) {
        this.a[n2][n3][7] = n4;
        this.a[n2][n3][8] = com.mnemonicstudios.novusapp.n.a.a[n4].getRawFrameCount();
        if (this.a[n2][n3][3] > this.a[n2][n3][8]) {
            this.a[n2][n3][3] = 0;
        }
    }

    public final void a(int n2, int n3) {
        if (!com.mnemonicstudios.novusapp.n.f) {
            this.a[n2][n3][3] = this.a[n2][n3][3] + 1;
            if (this.a[n2][n3][3] >= this.a[n2][n3][8]) {
                this.a[n2][n3][3] = 0;
            }
        }
    }

    public final void b(int n2, int n3) {
        if (!com.mnemonicstudios.novusapp.n.f) {
            this.a[n2][n3][3] = this.a[n2][n3][3] + 1;
            if (this.a[n2][n3][3] >= this.a[n2][n3][8]) {
                this.a[n2][n3][3] = this.a[n2][n3][8];
            }
        }
    }

    public final void c(int n2, int n3) {
        try {
            if (!com.mnemonicstudios.novusapp.n.f) {
                if (this.a[n2][n3][10] >= 0) {
                    this.a[n2][n3][3] = this.a[n2][n3][3] + 1;
                    if (this.a[n2][n3][3] >= this.a[n2][n3][8]) {
                        this.a[n2][n3][3] = this.a[n2][n3][8] - 1;
                        this.a[n2][n3][10] = -100;
                    }
                } else {
                    this.a[n2][n3][3] = this.a[n2][n3][3] - 1;
                    if (this.a[n2][n3][3] < 0) {
                        this.a[n2][n3][3] = 0;
                        this.a[n2][n3][10] = 100;
                    }
                }
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void a(int n2, int n3, boolean bl, int n4) {
        this.a(n2);
        this.f[n2] = n3;
        this.a[n2] = 0;
        com.mnemonicstudios.novusapp.r.c[n2] = 0;
        this.a[n2] = !bl;
        this.b[n2] = false;
        com.mnemonicstudios.novusapp.r.b[n2] = n2;
        this.j = 0;
        while (this.j < n3) {
            this.a(n2, n4);
            ++this.j;
        }
    }

    public final void a(int n2) {
        this.a[n2] = 0;
        this.a[n2] = false;
        this.b[n2] = false;
        com.mnemonicstudios.novusapp.r.c[n2] = 0;
        com.mnemonicstudios.novusapp.r.b[n2] = n2;
        this.j = 0;
        while (this.j < 8) {
            this.a[n2][this.j][4] = -100000;
            this.a[n2][this.j][12] = 0;
            this.a[n2][this.j][13] = 0;
            ++this.j;
        }
    }

    public final void d(int n2, int n3) {
        com.mnemonicstudios.novusapp.r.b[n2] = n3;
    }

    public final boolean a(int n2, int n3, int n4) {
        this.k = n2 - this.a[this.al][this.am][0];
        this.l = n3 - this.a[this.al][this.am][1];
        return n4 >= this.k * this.k + this.l * this.l;
    }

    public final void a(int n2, boolean bl) {
        this.a[n2] = bl;
        this.b[n2] = false;
        this.m = 0;
        while (this.m < this.aK) {
            this.a(n2);
            ++this.m;
        }
    }

    public final int a(int n2) {
        return this.a(n2, 100);
    }

    public final int a(int n2, int n3) {
        this.c = false;
        this.b[n2] = false;
        while (!this.c) {
            this.n = com.mnemonicstudios.novusapp.n.a(1022) + 1;
            if (com.mnemonicstudios.novusapp.j.a[this.n] <= 0) continue;
            this.p = 0;
            while (!(this.a(this.n + 1, this.p) || this.p >= 400 || this.a(this.n - 1, this.p) || this.p >= 400 || this.a(this.n, this.p) || this.p >= 400)) {
                ++this.p;
            }
            --this.p;
            this.v = 1023 * 1023 + 511 * 511;
            if (this.p <= 0 || this.p >= 382) continue;
            try {
                this.q = 0;
                while (this.q < this.aJ) {
                    this.r = 0;
                    while (this.r < this.aK) {
                        if (this.a[this.q][this.r][4] > 0) {
                            this.s = this.n - this.a[this.q][this.r][0];
                            this.t = this.p - this.a[this.q][this.r][1];
                            this.u = this.s * this.s + this.t * this.t;
                            if (this.u < this.v) {
                                this.v = this.u;
                            }
                        }
                        ++this.r;
                    }
                    ++this.q;
                }
            }
            catch (Exception exception) {
                Exception exception2 = exception;
                exception.printStackTrace();
            }
            if (this.v < 256) continue;
            this.o = this.p;
            this.c = true;
        }
        return this.a(this.n, this.o, n2, n3);
    }

    public final int a(int n2, int n3, int n4, int n5) {
        if (this.a[n4] < 8) {
            this.w = this.a[n4] | n4 << 4;
            this.a[n4][this.a[n4]][0] = n2;
            this.a[n4][this.a[n4]][1] = n3;
            this.a[n4][this.a[n4]][2] = com.mnemonicstudios.novusapp.n.a(1);
            this.a[n4][this.a[n4]][3] = 0;
            this.a[n4][this.a[n4]][9] = 0;
            this.a[n4][this.a[n4]][4] = n5;
            this.a[n4][this.a[n4]][13] = 0;
            this.a[n4][this.a[n4]][12] = 0;
            this.a[n4][this.a[n4]][11] = 2;
            this.a[n4][this.a[n4]][14] = -1;
            this.a[n4][this.a[n4]][15] = 0;
            this.a[n4][this.a[n4]][16] = com.mnemonicstudios.novusapp.n.a(com.mnemonicstudios.novusapp.n.c.length);
            this.a(n4, this.a[n4], com.mnemonicstudios.novusapp.n.a[b[n4]]);
            this.a[n4] = this.a[n4] + 1;
            return this.w;
        }
        return -1;
    }

    public final int a() {
        if (this.b[0]) {
            return 0;
        }
        this.x = 0;
        this.G = 0;
        while (this.G < this.aJ) {
            this.H = 0;
            if (!this.a[this.G]) {
                while (this.H < this.aK) {
                    if (this.a[this.G][this.H][4] > 0) {
                        ++this.x;
                    }
                    ++this.H;
                }
            }
            ++this.G;
        }
        return this.x;
    }

    public final int b() {
        this.x = 0;
        this.G = 0;
        while (this.G < this.aJ) {
            this.d = false;
            if (!this.b[this.G]) {
                this.H = 0;
                while (this.H < 4) {
                    if (this.a[this.G][this.H][4] > 0) {
                        this.d = true;
                    }
                    ++this.H;
                }
            }
            if (this.d) {
                ++this.x;
            }
            ++this.G;
        }
        return this.x;
    }

    public final void e(int n2, int n3) {
        this.c(this.am, this.al, n2, n3);
    }

    public final void c(int n2, int n3, int n4, int n5) {
        com.mnemonicstudios.novusapp.n.a(1);
        this.a[n3][n2][9] = 16;
        this.A = this.a[n3][n2][0] << 16;
        this.B = this.a[n3][n2][1] << 16;
        this.y = n4;
        this.z = n5;
        this.C = 0;
    }

    public final void a() {
        this.f(this.am, this.al);
    }

    public final void f(int n2, int n3) {
        this.a[n3][n2][9] = 15;
        this.D = 0;
    }

    public final void b() {
        this.g(this.am, this.al);
    }

    public final void g(int n2, int n3) {
        com.mnemonicstudios.novusapp.n.a(6);
        this.a[n3][n2][9] = 14;
        if (com.mnemonicstudios.novusapp.n.a.a(this.a[n3][n2][0], this.a[n3][n2][1], this.a[n3][n2][0], this.a[n3][n2][1] - 32)) {
            this.a[n3][n2][0] = com.mnemonicstudios.novusapp.n.a.ak;
            this.a[n3][n2][1] = com.mnemonicstudios.novusapp.n.a.al;
        } else {
            this.a[n3][n2][1] = this.a[n3][n2][1] - 32;
        }
        this.E = this.a[n3][n2][0];
        this.F = this.a[n3][n2][1];
        System.currentTimeMillis();
        this.a = System.currentTimeMillis() + 8000L;
    }

    public final int c() {
        this.x = 0;
        this.G = 0;
        while (this.G < this.aJ) {
            this.H = 0;
            if (this.a[this.G]) {
                while (this.H < this.aK) {
                    if (this.a[this.G][this.H][4] > 0) {
                        ++this.x;
                    }
                    ++this.H;
                }
            }
            ++this.G;
        }
        return this.x;
    }

    public final void b(int n2, int n3, int n4) {
        this.M = n4 * n4;
        this.P = (n4 + (n4 >> 1)) * (n4 + (n4 >> 1));
        this.G = 0;
        this.K = 0;
        this.e = false;
        while (this.G < this.aJ) {
            this.H = 0;
            while (this.H < this.aK) {
                this.I = Math.abs(this.a[this.G][this.H][0] - n2);
                this.J = Math.abs(this.a[this.G][this.H][1] - n3);
                if (this.I < n4 << 2 && this.J < n4 << 2) {
                    this.N = (this.a[this.G][this.H][0] - n2) * (this.a[this.G][this.H][0] - n2) + (this.a[this.G][this.H][1] - n3) * (this.a[this.G][this.H][1] - n3);
                    this.O = (this.a[this.G][this.H][0] - n2) * (this.a[this.G][this.H][0] - n2) + (this.a[this.G][this.H][1] - 12 - n3) * (this.a[this.G][this.H][1] - 12 - n3);
                    if (this.N <= this.M || this.O <= this.M) {
                        this.a[this.G][this.H][5] = this.a[this.G][this.H][0] < n2 ? -2 - com.mnemonicstudios.novusapp.n.a(4) : 2 + com.mnemonicstudios.novusapp.n.a(4);
                        this.a[this.G][this.H][6] = -12 - com.mnemonicstudios.novusapp.n.a(4);
                        this.a[this.G][this.H][9] = 4;
                        if (this.G == this.al && this.H == this.am) {
                            this.e = true;
                        }
                        if (this.a[this.G][this.H][4] >= 0) {
                            this.L = (n4 << 1) + com.mnemonicstudios.novusapp.n.a(5);
                            int[] nArray = this.a[this.G][this.H];
                            nArray[13] = nArray[13] - this.L;
                            if (this.a[this.G][this.H][13] < -100) {
                                this.a[this.G][this.H][13] = -100 + com.mnemonicstudios.novusapp.n.a(5);
                            }
                            this.K = this.G != this.al ? (this.K += this.L) : (this.K -= this.L);
                        }
                        if (com.mnemonicstudios.novusapp.n.a(100) > 50) {
                            this.c(this.G, this.H, com.mnemonicstudios.novusapp.n.a(1));
                        }
                    } else if (this.N <= this.P || this.O <= this.P) {
                        this.a[this.G][this.H][5] = this.a[this.G][this.H][0] < n2 ? -2 - com.mnemonicstudios.novusapp.n.a(1) : 2 + com.mnemonicstudios.novusapp.n.a(1);
                        this.a[this.G][this.H][6] = -8 - com.mnemonicstudios.novusapp.n.a(4);
                        this.a[this.G][this.H][9] = 4;
                        if (this.G == this.al && this.H == this.am) {
                            this.e = true;
                        }
                        if (this.a[this.G][this.H][4] >= 0) {
                            this.L = com.mnemonicstudios.novusapp.n.a(5) + (n4 >> 1);
                            int[] nArray = this.a[this.G][this.H];
                            nArray[13] = nArray[13] - this.L;
                            if (this.a[this.G][this.H][13] < -100) {
                                this.a[this.G][this.H][13] = -100 + com.mnemonicstudios.novusapp.n.a(5);
                            }
                            this.K = this.G != this.al ? (this.K += this.L) : (this.K -= this.L);
                        }
                    }
                }
                ++this.H;
            }
            int n5 = this.G++;
            c[n5] = c[n5] + this.K * 94761;
        }
        com.mnemonicstudios.novusapp.n.a.a(n2, n3, n4);
        if (this.e) {
            com.mnemonicstudios.novusapp.n.a.W = 1;
            this.Q = 16;
            com.mnemonicstudios.novusapp.n.a.k(this.a[this.al & 0xF][this.am & 0xF][0], this.a[this.al & 0xF][this.am & 0xF][1], 16);
        }
    }

    public final void c() {
        if (this.Q == 0) {
            return;
        }
        a = false;
        if (this.Q > 1) {
            --this.Q;
            this.R = 1;
            return;
        }
        switch (this.R) {
            case 1: {
                this.f = false;
                this.S = 0;
                while (this.S < this.aJ) {
                    this.T = 0;
                    while (this.T < this.aK) {
                        if (this.a[this.S][this.T][13] != 0) {
                            this.f = true;
                            this.a[this.S][this.T][12] = 16;
                            this.U = this.a[this.S][this.T][0];
                            this.V = this.a[this.S][this.T][1];
                            this.W = this.S;
                            this.X = this.T;
                            com.mnemonicstudios.novusapp.n.a.j(this.U, this.V, 20);
                            com.mnemonicstudios.novusapp.n.a(com.mnemonicstudios.novusapp.n.a.length);
                            com.mnemonicstudios.novusapp.n.a(com.mnemonicstudios.novusapp.n.b.length);
                            this.R = 2;
                            if (com.mnemonicstudios.novusapp.n.a(100) > 50) {
                                this.c(this.S, this.T, com.mnemonicstudios.novusapp.n.a(5));
                            }
                            return;
                        }
                        ++this.T;
                    }
                    ++this.S;
                }
                if (this.f) break;
                com.mnemonicstudios.novusapp.n.a.j();
                com.mnemonicstudios.novusapp.n.a.k(this.f(), this.g(), 24);
                this.Q = 0;
                return;
            }
            case 2: {
                if (com.mnemonicstudios.novusapp.n.a.W != 3) {
                    this.R = 3;
                }
                if (Math.abs(com.mnemonicstudios.novusapp.n.a.a() - this.U) >= 4 || Math.abs(com.mnemonicstudios.novusapp.n.a.a() - this.U) >= 4) break;
                int[] nArray = this.a[this.S][this.T];
                nArray[12] = nArray[12] - 1;
                if (this.a[this.S][this.T][12] != 0) break;
                int[] nArray2 = this.a[this.S][this.T];
                nArray2[4] = nArray2[4] + this.a[this.S][this.T][13];
                this.a[this.S][this.T][13] = 0;
                if (this.a[this.S][this.T][4] > 100) {
                    this.a[this.S][this.T][4] = 100;
                }
                if (this.a[this.S][this.T][4] < 0) {
                    this.a[this.S][this.T][4] = 0;
                }
                if (this.a[this.S][this.T][4] == 0) {
                    this.R = 3;
                    this.c(this.S, this.T, 3);
                    this.a[this.W][this.X][10] = 0;
                    this.a[this.W][this.X][9] = 7;
                    com.mnemonicstudios.novusapp.n.a.j(this.U, this.V, 20);
                    this.Y = 20;
                    return;
                }
                this.R = 1;
                return;
            }
            case 3: {
                --this.Y;
                if (this.Y >= 1) break;
                this.R = 1;
                this.a[this.W][this.X][4] = -100000;
            }
        }
    }

    public final int d() {
        return this.aJ;
    }

    public final int b(int n2) {
        return this.f[n2];
    }

    public final void c(int n2, int n3, int n4) {
        try {
            if (this.a[n2][n3][14] < 0 && this.a[n2][n3][4] > 0) {
                this.a[n2][n3][14] = 0;
                this.a[n2][n3][15] = n4 + (com.mnemonicstudios.novusapp.n.a(64) + 32 << 16);
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public final void d(int n2, int n3, int n4) {
        if (n4 + this.a[n2][n2][4] > 100) {
            return;
        }
        this.a[n2][n3][12] = 16;
        int[] nArray = this.a[n2][n3];
        nArray[13] = nArray[13] + n4;
    }

    public final void h(int n2, int n3) {
        if (this.Q != 0) {
            return;
        }
        if (this.a[n2][n3][12] > 0) {
            int[] nArray = this.a[n2][n3];
            nArray[12] = nArray[12] - 1;
            if (this.a[n2][n3][12] == 1) {
                if (this.a[n2][n3][13] + this.a[n2][n3][4] > 100) {
                    this.a[n2][n3][4] = 100;
                    return;
                }
                int[] nArray2 = this.a[n2][n3];
                nArray2[4] = nArray2[4] + this.a[n2][n3][13];
                this.a[n2][n3][13] = 0;
            }
        }
    }

    public final void i(int n2, int n3) {
        if (this.a[n2][n3][14] >= 0) {
            int[] nArray = this.a[n2][n3];
            nArray[14] = nArray[14] + 1;
            if (this.a[n2][n3][14] > this.a[n2][n3][15] >> 16) {
                this.a[n2][n3][14] = -1;
            }
        }
    }

    public final void j(int n2, int n3) {
        com.mnemonicstudios.novusapp.n.a(7);
        this.a[this.al][this.am][9] = 11;
        this.a[this.al][this.am][10] = 1;
        this.a[this.al][this.am][3] = 0;
        this.a[this.al][this.am][17] = n2;
        this.a[this.al][this.am][18] = n3;
        this.a[this.al][this.am][11] = 2;
    }

    public final boolean b(int n2, int n3, int n4) {
        this.ab = this.a[this.ax][this.ay][0];
        this.ac = this.a[this.ax][this.ay][1] - 10;
        this.Z = n4 > 0 ? -4 : 4;
        this.aa = -16;
        this.g = false;
        this.ah = 0;
        while (!this.g) {
            ++this.ah;
            if (this.ah > 500) {
                return false;
            }
            this.ad = this.ab;
            this.ae = this.ac;
            this.aa += b;
            this.af = this.ad + this.Z;
            this.ag = this.ae + this.aa;
            if (this.ag > com.mnemonicstudios.novusapp.j.cf) {
                return false;
            }
            if (com.mnemonicstudios.novusapp.n.a.a(this.ad, this.ae, this.af, this.ag)) {
                this.Z = 0;
                this.aa = 0;
                this.g = true;
                this.ab = com.mnemonicstudios.novusapp.n.a.ak;
                this.ac = com.mnemonicstudios.novusapp.n.a.al;
                if (this.b(n2, n3, this.af, this.ag) <= 0) continue;
                this.ab = this.ap;
                this.ac = this.aO + 4;
                continue;
            }
            if (this.aa > 0) {
                if (this.b(n2, n3, this.af, this.ag) > 0) {
                    this.ab = this.ap;
                    this.ac = this.aO + 4;
                    this.Z = 0;
                    this.aa = 0;
                    this.g = true;
                    continue;
                }
                this.ab = this.af;
                this.ac = this.ag;
                continue;
            }
            this.ab = this.af;
            this.ac = this.ag;
        }
        return true;
    }

    public final void d() {
        Exception exception;
        try {
            if (this.Q > 0) {
                this.c();
            }
        }
        catch (Exception exception2) {
            exception = exception2;
            exception2.printStackTrace();
        }
        this.ax = 0;
        while (this.ax < this.aJ) {
            this.ay = 0;
            while (this.ay < this.aK) {
                if (this.h && this.a[this.al][this.am][9] != 3) {
                    this.a[this.al][this.am][9] = 0;
                    a = 0;
                    this.h = false;
                    a = true;
                    com.mnemonicstudios.novusapp.n.a.r = false;
                    com.mnemonicstudios.novusapp.n.a.s = false;
                    com.mnemonicstudios.novusapp.n.a.t = false;
                    com.mnemonicstudios.novusapp.n.a.u = false;
                    com.mnemonicstudios.novusapp.n.a.v = false;
                    com.mnemonicstudios.novusapp.n.a.w = false;
                    com.mnemonicstudios.novusapp.n.a.x = false;
                }
                try {
                    this.az = 0;
                    this.i(this.ax, this.ay);
                    if (this.a[this.ax][this.ay][9] != 14 && this.a[this.ax][this.ay][9] != 16) {
                        this.an = this.a[this.ax][this.ay][0];
                        this.ao = this.a[this.ax][this.ay][1];
                        if (this.a(this.an, this.ao)) {
                            if (this.a[this.ax][this.ay][6] < 0) {
                                if (!this.a(this.an, this.ao + 1)) {
                                    ++this.ao;
                                } else if (!this.a(this.an, this.ao + 2)) {
                                    this.ao += 2;
                                }
                            } else if (!this.a(this.an, this.ao - 1)) {
                                --this.ao;
                            } else if (!this.a(this.an, this.ao - 2)) {
                                this.ao -= 2;
                            }
                        }
                        int[] nArray = this.a[this.ax][this.ay];
                        nArray[6] = nArray[6] + b;
                        if (this.a[this.ax][this.ay][6] == 1) {
                            this.a[this.ax][this.ay][6] = 2;
                        }
                        this.ap = this.an + this.a[this.ax][this.ay][5];
                        this.aq = this.ao + this.a[this.ax][this.ay][6];
                        this.az = 1;
                        if (this.a[this.ax][this.ay][9] != 8) {
                            this.h(this.ax, this.ay);
                        }
                        if (this.aq > com.mnemonicstudios.novusapp.j.cf && this.a[this.ax][this.ay][9] != 8) {
                            com.mnemonicstudios.novusapp.n.a(4);
                            this.a[this.ax][this.ay][9] = 8;
                            this.a[this.ax][this.ay][3] = 0;
                            this.a[this.ax][this.ay][4] = -100000;
                            this.a[this.ax][this.ay][13] = 0;
                            this.a[this.ax][this.ay][12] = 0;
                            this.a[this.ax][this.ay][14] = -1;
                            this.a[this.ax][this.ay][15] = 0;
                            if (this.ax == this.al && this.ay == this.am) {
                                com.mnemonicstudios.novusapp.n.a.Q = 16;
                                com.mnemonicstudios.novusapp.n.a.k(this.f(), this.g(), 16);
                            }
                        }
                        this.az = 2;
                        if (com.mnemonicstudios.novusapp.n.a.a(this.an, this.ao, this.ap, this.aq)) {
                            if (this.a[this.ax][this.ay][6] > 24 && this.a[this.ax][this.ay][4] > 0) {
                                com.mnemonicstudios.novusapp.n.a(9);
                                int[] nArray2 = this.a[this.ax][this.ay];
                                nArray2[13] = nArray2[13] - this.a[this.ax][this.ay][6];
                                if (this.ax == this.al && this.ay == this.am) {
                                    com.mnemonicstudios.novusapp.n.a.W = 1;
                                    this.Q = 16;
                                    com.mnemonicstudios.novusapp.n.a.k(this.f(), this.g(), 16);
                                }
                            }
                            this.a[this.ax][this.ay][5] = 0;
                            this.a[this.ax][this.ay][6] = 0;
                            this.a(com.mnemonicstudios.novusapp.n.a.ak, com.mnemonicstudios.novusapp.n.a.al);
                            this.a[this.ax][this.ay][0] = com.mnemonicstudios.novusapp.n.a.ak;
                            this.a[this.ax][this.ay][1] = com.mnemonicstudios.novusapp.n.a.al;
                            this.a[this.ax][this.ay][19] = 0;
                            if (this.b(this.ax, this.ay, this.ap, this.aq) > 0) {
                                this.a[this.ax][this.ay][0] = this.ap;
                                this.a[this.ax][this.ay][1] = this.aO + 4;
                            }
                        } else if (this.a[this.ax][this.ay][6] > 0) {
                            if (this.b(this.ax, this.ay, this.ap, this.aq) > 0) {
                                this.a[this.ax][this.ay][0] = this.ap;
                                this.a[this.ax][this.ay][1] = this.aO + 4;
                                this.a[this.ax][this.ay][5] = 0;
                                this.a[this.ax][this.ay][6] = 0;
                            } else {
                                this.a[this.ax][this.ay][0] = this.ap;
                                this.a[this.ax][this.ay][1] = this.aq;
                            }
                        } else {
                            this.a[this.ax][this.ay][0] = this.ap;
                            this.a[this.ax][this.ay][1] = this.aq;
                        }
                    }
                    this.az = 3;
                    switch (this.a[this.ax][this.ay][9]) {
                        case 7: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.d[b[this.ax]]);
                            this.a[this.ax][this.ay][10] = this.a[this.ax][this.ay][10] + 1;
                            this.a[this.ax][this.ay][3] = this.a[this.ax][this.ay][10] >> 2;
                            if (this.a[this.ax][this.ay][3] <= 2) break;
                            this.a[this.ax][this.ay][9] = 8;
                            this.a[this.ax][this.ay][3] = 0;
                            this.a[this.ax][this.ay][4] = -100000;
                            this.a[this.ax][this.ay][14] = -1;
                            this.a[this.ax][this.ay][15] = 0;
                            com.mnemonicstudios.novusapp.n.a.g(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1], 32);
                            this.b(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1], 16);
                            com.mnemonicstudios.novusapp.n.a(1);
                            com.mnemonicstudios.novusapp.n.a.a(16);
                            com.mnemonicstudios.novusapp.n.a.W = 1;
                            this.Q = 32;
                            com.mnemonicstudios.novusapp.n.a.k(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1], 32);
                            break;
                        }
                        case 8: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.j);
                            break;
                        }
                        case 0: {
                            if (this.as > 0) {
                                --this.as;
                            }
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a[b[this.ax]]);
                            if (this.ax == this.al && this.ay == this.am) {
                                if (!a) break;
                                if (this.a[this.ax]) {
                                    com.mnemonicstudios.novusapp.n.a.r = false;
                                    com.mnemonicstudios.novusapp.n.a.s = false;
                                    com.mnemonicstudios.novusapp.n.a.t = false;
                                    com.mnemonicstudios.novusapp.n.a.u = false;
                                    com.mnemonicstudios.novusapp.n.a.v = false;
                                    com.mnemonicstudios.novusapp.n.a.w = false;
                                    com.mnemonicstudios.novusapp.n.a.x = false;
                                    switch (a) {
                                        case 4: {
                                            if (this.a(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1], this.ax, 10)) {
                                                if (this.a[this.ax][this.ay][0] - this.bh < 0) {
                                                    if (this.b(this.ax, this.ay, 0)) {
                                                        this.a[this.ax][this.ay][2] = 0;
                                                        com.mnemonicstudios.novusapp.n.a.w = true;
                                                    } else if (this.b(this.ax, this.ay, 1)) {
                                                        this.a[this.ax][this.ay][2] = 1;
                                                        com.mnemonicstudios.novusapp.n.a.w = true;
                                                    }
                                                } else if (this.b(this.ax, this.ay, 1)) {
                                                    this.a[this.ax][this.ay][2] = 1;
                                                    com.mnemonicstudios.novusapp.n.a.w = true;
                                                } else if (this.b(this.ax, this.ay, 0)) {
                                                    this.a[this.ax][this.ay][2] = 0;
                                                    com.mnemonicstudios.novusapp.n.a.w = true;
                                                }
                                            } else if (this.b(this.ax, this.ay, 1)) {
                                                this.a[this.ax][this.ay][2] = 1;
                                                com.mnemonicstudios.novusapp.n.a.w = true;
                                            } else if (this.b(this.ax, this.ay, 0)) {
                                                this.a[this.ax][this.ay][2] = 0;
                                                com.mnemonicstudios.novusapp.n.a.w = true;
                                            }
                                            a = 0;
                                            break;
                                        }
                                        case 0: {
                                            if (com.mnemonicstudios.novusapp.n.a(100) <= 10) {
                                                a = 4;
                                                break;
                                            }
                                            a = 5;
                                            this.aA = 3072;
                                            this.aC = 0;
                                            this.aD = 32;
                                            this.aB = 25;
                                            this.aE = 20;
                                            this.aF = 128;
                                            this.c(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a(5));
                                            com.mnemonicstudios.novusapp.n.a.r = false;
                                            com.mnemonicstudios.novusapp.n.a.s = false;
                                            com.mnemonicstudios.novusapp.n.a.t = false;
                                            com.mnemonicstudios.novusapp.n.a.u = false;
                                            com.mnemonicstudios.novusapp.n.a.v = false;
                                            com.mnemonicstudios.novusapp.n.a.w = false;
                                            com.mnemonicstudios.novusapp.n.a.x = false;
                                            this.a[this.ax][this.ay][11] = com.mnemonicstudios.novusapp.n.a(10) + 1;
                                            if (this.a[this.ax][this.ay][11] == 17) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (com.mnemonicstudios.novusapp.g.a[this.ax][this.a[this.ax][this.ay][11]][0] == 0) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 7) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 3) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 9) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 20) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 6) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 10) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 4) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 22) {
                                                this.a[this.ax][this.ay][11] = 2;
                                            }
                                            if (this.a[this.ax][this.ay][11] != 5) break;
                                            this.a[this.ax][this.ay][11] = 2;
                                            break;
                                        }
                                        case 5: {
                                            this.c(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a(5));
                                            this.aB += this.aE;
                                            if (this.aB >= 200) {
                                                this.aC += this.aD;
                                                this.aB = 25;
                                            }
                                            if (this.aC > 2000) {
                                                a = 4;
                                                break;
                                            }
                                            if (com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, this.aA + this.aC & 0xFFF, this.aB, this.a[this.al][this.am & 0xF][11]) && this.b(com.mnemonicstudios.novusapp.n.a.ao, com.mnemonicstudios.novusapp.n.a.ap, this.ax, this.aF)) {
                                                this.aH = this.aA + this.aC & 0xFFF;
                                                this.aG = this.aB;
                                                if (this.aH < 3072) {
                                                    this.ak = 2048;
                                                    this.a[this.ax][this.ay][2] = 1;
                                                } else {
                                                    this.ak = 4095;
                                                    this.a[this.ax][this.ay][2] = 0;
                                                }
                                                a = 1;
                                                com.mnemonicstudios.novusapp.n.a.r = true;
                                                break;
                                            }
                                            if (com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, this.aA - this.aC & 0xFFF, this.aB, this.a[this.al][this.am & 0xF][11]) && this.b(com.mnemonicstudios.novusapp.n.a.ao, com.mnemonicstudios.novusapp.n.a.ap, this.ax, this.aF)) {
                                                this.aH = this.aA - this.aC & 0xFFF;
                                                this.aG = this.aB;
                                                if (this.aH < 3072) {
                                                    this.ak = 2048;
                                                    this.a[this.ax][this.ay][2] = 1;
                                                } else {
                                                    this.ak = 4095;
                                                    this.a[this.ax][this.ay][2] = 0;
                                                }
                                                a = 1;
                                                com.mnemonicstudios.novusapp.n.a.r = true;
                                                break;
                                            }
                                            if (this.a[this.ax][this.ay][11] == 1 || this.a[this.ax][this.ay][11] == 21) break;
                                            if (com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, this.aA - this.aC - (this.aD >> 1) & 0xFFF, this.aB, this.a[this.al][this.am & 0xF][11]) && this.b(com.mnemonicstudios.novusapp.n.a.ao, com.mnemonicstudios.novusapp.n.a.ap, this.ax, this.aF)) {
                                                this.aH = this.aA - this.aC - (this.aD >> 1) & 0xFFF;
                                                this.aG = this.aB;
                                                if (this.aH < 3072) {
                                                    this.ak = 2048;
                                                    this.a[this.ax][this.ay][2] = 1;
                                                } else {
                                                    this.ak = 4095;
                                                    this.a[this.ax][this.ay][2] = 0;
                                                }
                                                a = 1;
                                                com.mnemonicstudios.novusapp.n.a.r = true;
                                                break;
                                            }
                                            if (!com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, this.aA + this.aC + (this.aD >> 1) & 0xFFF, this.aB, this.a[this.al][this.am & 0xF][11]) || !this.b(com.mnemonicstudios.novusapp.n.a.ao, com.mnemonicstudios.novusapp.n.a.ap, this.ax, this.aF)) break;
                                            this.aH = this.aA + this.aC + (this.aD >> 1) & 0xFFF;
                                            this.aG = this.aB;
                                            if (this.aH < 3072) {
                                                this.ak = 2048;
                                                this.a[this.ax][this.ay][2] = 1;
                                            } else {
                                                this.ak = 4095;
                                                this.a[this.ax][this.ay][2] = 0;
                                            }
                                            a = 1;
                                            com.mnemonicstudios.novusapp.n.a.r = true;
                                        }
                                    }
                                }
                                if (this.ax == this.al && this.ay == this.am && a && !this.a[this.ax] && com.mnemonicstudios.novusapp.n.a() && com.mnemonicstudios.novusapp.n.a.W != 2) {
                                    com.mnemonicstudios.novusapp.n.a.W = 1;
                                    com.mnemonicstudios.novusapp.n.a.a(1);
                                }
                                if (com.mnemonicstudios.novusapp.n.a.b()) {
                                    if (!com.mnemonicstudios.novusapp.n.a.c()) break;
                                    this.a[this.ax][this.ay][11] = com.mnemonicstudios.novusapp.n.a.c();
                                    break;
                                }
                                if (com.mnemonicstudios.novusapp.n.a.r || com.mnemonicstudios.novusapp.n.a.s) {
                                    this.a[this.ax][this.ay][9] = 3;
                                }
                                if (com.mnemonicstudios.novusapp.n.a.t) {
                                    this.ak = 2048;
                                    this.a(this.ax, this.ay);
                                    this.a[this.ax][this.ay][2] = 1;
                                    --this.ap;
                                    if (!this.a(this.ap, this.aq)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq;
                                    } else if (!this.a(this.ap, this.aq - 1)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 1;
                                    } else if (!this.a(this.ap, this.aq - 2)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 2;
                                    } else if (!this.a(this.ap, this.aq - 3)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 3;
                                    } else if (!this.a(this.ap, this.aq - 4)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 4;
                                    }
                                }
                                if (com.mnemonicstudios.novusapp.n.a.u) {
                                    this.ak = 0;
                                    this.a(this.ax, this.ay);
                                    ++this.ap;
                                    this.a[this.ax][this.ay][2] = 0;
                                    if (!this.a(this.ap, this.aq)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq;
                                    } else if (!this.a(this.ap, this.aq - 1)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 1;
                                    } else if (!this.a(this.ap, this.aq - 2)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 2;
                                    } else if (!this.a(this.ap, this.aq - 3)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 3;
                                    } else if (!this.a(this.ap, this.aq - 4)) {
                                        this.a[this.ax][this.ay][0] = this.ap;
                                        this.a[this.ax][this.ay][1] = this.aq - 4;
                                    }
                                }
                                if (com.mnemonicstudios.novusapp.n.a.v) {
                                    if (this.a[this.ax][this.ay][11] == 12) {
                                        com.mnemonicstudios.novusapp.n.a.a(0, this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1], this.ak, this.ar >> 1);
                                        com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][11], this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, 3072, 0);
                                    }
                                    if (this.a[this.ax][this.ay][11] == 4) {
                                        this.a();
                                    }
                                    if (this.a[this.ax][this.ay][11] == 15) {
                                        this.a[this.ax][this.ay][13] = -500;
                                        com.mnemonicstudios.novusapp.n.a.W = 1;
                                        this.Q = 3;
                                    }
                                    if (this.a[this.ax][this.ay][11] == 16) {
                                        com.mnemonicstudios.novusapp.n.a.b[com.mnemonicstudios.novusapp.n.a.al] = true;
                                        com.mnemonicstudios.novusapp.n.a.W = 1;
                                        com.mnemonicstudios.novusapp.n.a.Q = 8;
                                        com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
                                    }
                                    if (this.a[this.ax][this.ay][11] == 20) {
                                        com.mnemonicstudios.novusapp.n.a.a(0, this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1], this.ak, this.ar >> 1);
                                        com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][11], this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, 3072, 0);
                                        this.a[this.ax][this.ay][9] = 0;
                                    }
                                    if (this.a[this.ax][this.ay][11] == 6) {
                                        com.mnemonicstudios.novusapp.n.a.a(0, this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1], this.ak, this.ar >> 1);
                                        com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][11], this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, 3072, 0);
                                        this.a[this.ax][this.ay][9] = 0;
                                    }
                                }
                                if (com.mnemonicstudios.novusapp.n.a.w && this.as == 0) {
                                    this.a[this.ax][this.ay][5] = this.a[this.ax][this.ay][2] > 0 ? -4 : 4;
                                    this.a[this.ax][this.ay][6] = -16;
                                    this.i = true;
                                    this.a[this.ax][this.ay][9] = 1;
                                    this.as = 32;
                                    com.mnemonicstudios.novusapp.n.a(0);
                                    if (com.mnemonicstudios.novusapp.n.a.a(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1], this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1] + this.a[this.ax][this.ay][6])) {
                                        this.a[this.ax][this.ay][0] = com.mnemonicstudios.novusapp.n.a.ak;
                                        this.a[this.ax][this.ay][1] = com.mnemonicstudios.novusapp.n.a.al;
                                    } else {
                                        int[] nArray = this.a[this.ax][this.ay];
                                        nArray[1] = nArray[1] + this.a[this.ax][this.ay][6];
                                    }
                                }
                                if (!com.mnemonicstudios.novusapp.n.a.x || this.as != 0) break;
                                this.a[this.ax][this.ay][5] = this.a[this.ax][this.ay][2] > 0 ? 4 : -4;
                                this.a[this.ax][this.ay][6] = -16;
                                this.i = true;
                                this.a[this.ax][this.ay][9] = 12;
                                this.as = 32;
                                com.mnemonicstudios.novusapp.n.a(0);
                                if (com.mnemonicstudios.novusapp.n.a.a(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1], this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1] + this.a[this.ax][this.ay][6])) {
                                    this.a[this.ax][this.ay][0] = com.mnemonicstudios.novusapp.n.a.ak;
                                    this.a[this.ax][this.ay][1] = com.mnemonicstudios.novusapp.n.a.al;
                                    break;
                                }
                                int[] nArray = this.a[this.ax][this.ay];
                                nArray[1] = nArray[1] + this.a[this.ax][this.ay][6];
                                break;
                            }
                            if (com.mnemonicstudios.novusapp.n.a(10000) <= 9995) break;
                            this.c(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a(4));
                            break;
                        }
                        case 1: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.c[b[this.ax]]);
                            if (this.a[this.ax][this.ay][5] != 0 || this.a[this.ax][this.ay][6] != 0) break;
                            this.a[this.ax][this.ay][9] = 0;
                            this.a[this.ax][this.ay][10] = 0;
                            break;
                        }
                        case 12: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.m[b[this.ax]]);
                            this.b(this.ax, this.ay);
                            if (this.a[this.ax][this.ay][5] != 0 || this.a[this.ax][this.ay][6] != 0) break;
                            this.a[this.ax][this.ay][9] = 0;
                            this.a[this.ax][this.ay][10] = 0;
                            break;
                        }
                        case 16: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.r[b[this.ax]]);
                            int[] nArray = this.a[this.ax][this.ay];
                            nArray[3] = nArray[3] + 1;
                            if (this.a[this.ax][this.ay][3] > 2) {
                                this.a[this.ax][this.ay][3] = 0;
                                this.A += this.y;
                                this.B += this.z;
                                if (!com.mnemonicstudios.novusapp.n.a.a(this.A >> 16, this.B >> 16, this.A + (this.y << 4) >> 16, this.B + (this.z << 4) >> 16)) {
                                    this.a[this.ax][this.ay][9] = 0;
                                } else {
                                    com.mnemonicstudios.novusapp.j.i(this.A >> 16, this.B >> 16, 10);
                                    this.a[this.ax][this.ay][0] = this.A >> 16;
                                    this.a[this.ax][this.ay][1] = (this.B >> 16) + 8;
                                    ++this.C;
                                }
                            }
                            if (this.C > 96) {
                                this.a[this.ax][this.ay][9] = 0;
                                com.mnemonicstudios.novusapp.n.a.W = 1;
                                this.Q = 16;
                                com.mnemonicstudios.novusapp.n.a.k(this.a[this.al & 0xF][this.am & 0xF][0], this.a[this.al & 0xF][this.am & 0xF][1], 16);
                            }
                            if (!com.mnemonicstudios.novusapp.n.a.r && !com.mnemonicstudios.novusapp.n.a.s && !com.mnemonicstudios.novusapp.n.a.t && !com.mnemonicstudios.novusapp.n.a.u) break;
                            this.a[this.ax][this.ay][9] = 0;
                            com.mnemonicstudios.novusapp.n.a.W = 1;
                            this.Q = 16;
                            com.mnemonicstudios.novusapp.n.a.k(this.a[this.al & 0xF][this.am & 0xF][0], this.a[this.al & 0xF][this.am & 0xF][1], 16);
                            break;
                        }
                        case 15: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.q[b[this.ax]]);
                            ++this.D;
                            if (this.D == 8) {
                                this.a(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1], this.a[this.ax][this.ay][2], 24);
                            }
                            this.a[this.ax][this.ay][3] = this.D > 8 ? 1 : 0;
                            if (this.D <= 12) break;
                            this.a[this.ax][this.ay][9] = 0;
                            com.mnemonicstudios.novusapp.n.a.d(this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1]);
                            break;
                        }
                        case 14: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.p[b[this.ax]]);
                            this.E = this.a[this.ax][this.ay][0];
                            this.F = this.a[this.ax][this.ay][1];
                            int[] nArray = this.a[this.ax][this.ay];
                            nArray[1] = nArray[1] + 1;
                            if (com.mnemonicstudios.novusapp.n.a.r) {
                                int[] nArray3 = this.a[this.ax][this.ay];
                                nArray3[1] = nArray3[1] - 4;
                            }
                            if (com.mnemonicstudios.novusapp.n.a.s) {
                                int[] nArray4 = this.a[this.ax][this.ay];
                                nArray4[1] = nArray4[1] + 4;
                            }
                            if (com.mnemonicstudios.novusapp.n.a.t) {
                                int[] nArray5 = this.a[this.ax][this.ay];
                                nArray5[0] = nArray5[0] - 4;
                                this.a[this.ax][this.ay][2] = 1;
                            }
                            if (com.mnemonicstudios.novusapp.n.a.u) {
                                int[] nArray6 = this.a[this.ax][this.ay];
                                nArray6[0] = nArray6[0] + 4;
                                this.a[this.ax][this.ay][2] = 0;
                            }
                            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, this.E + (com.mnemonicstudios.novusapp.n.a(8) - 4), this.F + com.mnemonicstudios.novusapp.n.a(8), com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 262144, 20, 0);
                            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, this.E + (com.mnemonicstudios.novusapp.n.a(8) - 4), this.F + com.mnemonicstudios.novusapp.n.a(8), com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 262144, 20, 0);
                            if (com.mnemonicstudios.novusapp.n.a.a(this.E, this.F, this.a[this.ax][this.ay][0], this.a[this.ax][this.ay][1])) {
                                this.a[this.ax][this.ay][0] = this.E;
                                this.a[this.ax][this.ay][1] = this.F;
                                this.a[this.ax][this.ay][9] = 0;
                                com.mnemonicstudios.novusapp.n.a.W = 1;
                                com.mnemonicstudios.novusapp.n.a.Q = 16;
                                com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
                            }
                            if (System.currentTimeMillis() <= this.a) break;
                            this.a[this.ax][this.ay][0] = this.E;
                            this.a[this.ax][this.ay][1] = this.F;
                            this.a[this.ax][this.ay][9] = 0;
                            com.mnemonicstudios.novusapp.n.a.W = 1;
                            com.mnemonicstudios.novusapp.n.a.Q = 32;
                            com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 32);
                            break;
                        }
                        case 2: {
                            break;
                        }
                        case 13: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.n[b[this.ax]]);
                            if (com.mnemonicstudios.novusapp.n.a.v && !this.b) {
                                this.b = true;
                                this.h = this.a[this.ax][this.ay][0] << 16;
                                this.i = this.a[this.ax][this.ay][1] << 16;
                            }
                            if (!this.b) break;
                            if (com.mnemonicstudios.novusapp.n.a.a(this.h >> 16, this.i >> 16, this.h + this.f >> 16, this.i + this.g >> 16)) {
                                this.a[this.ax][this.ay][0] = com.mnemonicstudios.novusapp.n.a.ak;
                                this.a[this.ax][this.ay][1] = com.mnemonicstudios.novusapp.n.a.al;
                                this.b = false;
                                this.a[this.ax][this.ay][9] = 0;
                                break;
                            }
                            this.h += this.f;
                            this.i += this.g;
                            this.a[this.ax][this.ay][0] = this.h >> 16;
                            this.a[this.ax][this.ay][1] = this.i >> 16;
                            break;
                        }
                        case 3: {
                            if (this.ax != this.al || this.ay != this.am) break;
                            this.a[this.ax][this.ay][2] = this.ak > 1024 && this.ak < 3072 ? 1 : 0;
                            switch (this.a[this.ax][this.ay][11]) {
                                case 2: 
                                case 18: 
                                case 19: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.e[b[this.ax]]);
                                    this.h = true;
                                    break;
                                }
                                case 7: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.k[b[this.ax]]);
                                    this.h = true;
                                    break;
                                }
                                case 22: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.h[b[this.ax]]);
                                    this.h = true;
                                    break;
                                }
                                case 1: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.g[b[this.ax]]);
                                    this.h = true;
                                    break;
                                }
                                case 21: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.j[b[this.ax]]);
                                    this.h = true;
                                    break;
                                }
                                case 8: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.i[b[this.ax]]);
                                    this.h = true;
                                }
                                case 14: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a[b[this.ax]]);
                                    this.h = true;
                                    break;
                                }
                                case 3: {
                                    this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.o[b[this.ax]]);
                                    this.h = true;
                                }
                            }
                            if (this.j) {
                                this.ar = com.mnemonicstudios.novusapp.n.a.b();
                            } else {
                                this.j = false;
                                com.mnemonicstudios.novusapp.n.a.b();
                                this.ar = 0;
                                if (this.ax == this.al && this.ay == this.am && a) {
                                    if (this.a[this.ax]) {
                                        com.mnemonicstudios.novusapp.n.a.r = false;
                                        com.mnemonicstudios.novusapp.n.a.s = false;
                                        com.mnemonicstudios.novusapp.n.a.t = false;
                                        com.mnemonicstudios.novusapp.n.a.u = false;
                                        com.mnemonicstudios.novusapp.n.a.v = false;
                                        com.mnemonicstudios.novusapp.n.a.w = false;
                                        com.mnemonicstudios.novusapp.n.a.x = false;
                                        this.e();
                                    } else if (com.mnemonicstudios.novusapp.n.a() && com.mnemonicstudios.novusapp.n.a.W != 2) {
                                        this.a[this.ax][this.ay][9] = 0;
                                        com.mnemonicstudios.novusapp.n.a.W = 1;
                                        com.mnemonicstudios.novusapp.n.a.a(2);
                                    }
                                    if (com.mnemonicstudios.novusapp.n.a.b()) {
                                        if (com.mnemonicstudios.novusapp.n.a.c()) {
                                            this.a[this.ax][this.ay][11] = com.mnemonicstudios.novusapp.n.a.c();
                                        }
                                    } else {
                                        if (com.mnemonicstudios.novusapp.n.a.r) {
                                            if (this.a[this.ax][this.ay][2] == 1) {
                                                this.ak += 32;
                                                this.ak &= 0xFFF;
                                                if (this.ak >= 3072) {
                                                    this.ak = 3071;
                                                }
                                            } else {
                                                this.ak -= 32;
                                                this.ak &= 0xFFF;
                                                if (this.ak <= 3072 && this.ak >= 1024) {
                                                    this.ak = 3073;
                                                }
                                            }
                                            this.ak &= 0xFFF;
                                            this.a[this.ax][this.ay][3] = 17 - (this.ak - 1024 & 0xFFF) / 228;
                                        }
                                        if (com.mnemonicstudios.novusapp.n.a.s) {
                                            if (this.a[this.ax][this.ay][2] == 0) {
                                                this.ak += 32;
                                                this.ak &= 0xFFF;
                                                if (this.ak <= 3072 && this.ak >= 1024) {
                                                    this.ak = 1023;
                                                }
                                            } else {
                                                this.ak -= 32;
                                                this.ak &= 0xFFF;
                                                if (this.ak <= 1024) {
                                                    this.ak = 1025;
                                                }
                                            }
                                            this.ak &= 0xFFF;
                                            this.a[this.ax][this.ay][3] = 17 - (this.ak - 1024 & 0xFFF) / 228;
                                        }
                                        if (com.mnemonicstudios.novusapp.n.a.t || com.mnemonicstudios.novusapp.n.a.u) {
                                            this.a[this.ax][this.ay][9] = 0;
                                            this.h = false;
                                            this.ak = 3072;
                                        }
                                    }
                                }
                                this.ai = com.mnemonicstudios.novusapp.j.i[this.ak] >> 11;
                                this.aj = com.mnemonicstudios.novusapp.j.j[this.ak] >> 11;
                            }
                            if (!a) break;
                            if (this.a[this.ax]) {
                                this.e();
                            }
                            if (com.mnemonicstudios.novusapp.n.a.v && !this.j) {
                                this.j = true;
                                com.mnemonicstudios.novusapp.n.a.a();
                                this.ar = 0;
                                if (this.a[this.ax][this.ay][11] == 14) {
                                    com.mnemonicstudios.novusapp.n.a.a(0, this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1], this.ak, this.ar >> 1);
                                    com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][11], this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, this.ak, this.ar);
                                    this.h = false;
                                    this.ak = 3072;
                                    this.ar = 0;
                                    this.j = false;
                                    com.mnemonicstudios.novusapp.n.a.c();
                                }
                            }
                            if ((com.mnemonicstudios.novusapp.n.a.v || !this.j) && this.ar != 200) break;
                            this.j = false;
                            com.mnemonicstudios.novusapp.n.a.c();
                            com.mnemonicstudios.novusapp.n.a.a(0, this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1], this.ak, this.ar >> 1);
                            com.mnemonicstudios.novusapp.n.a.a(this.a[this.al][this.am & 0xF][11], this.a[this.al][this.am & 0xF][0], this.a[this.al][this.am & 0xF][1] - 16, this.ak, this.ar);
                            this.a[this.ax][this.ay][9] = 0;
                            this.h = false;
                            this.ak = 3072;
                            this.ar = 0;
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a[b[this.ax]]);
                            break;
                        }
                        case 11: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.l[b[this.ax]]);
                            this.c(this.ax, this.ay);
                            try {
                                if (this.a[this.al][this.am][3] == 10) {
                                    this.a[this.al][this.am][0] = this.a[this.al][this.am][17];
                                    this.a[this.al][this.am][1] = this.a[this.al][this.am][18];
                                }
                            }
                            catch (Exception exception3) {
                                exception = exception3;
                                exception3.printStackTrace();
                            }
                            if (this.a[this.al][this.am][3] != 0) break;
                            this.a[this.al][this.am][9] = 0;
                            com.mnemonicstudios.novusapp.n.a.W = 1;
                            com.mnemonicstudios.novusapp.n.a.Q = 16;
                            com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
                            break;
                        }
                        case 10: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.f[b[this.ax]]);
                            this.c(this.ax, this.ay);
                            break;
                        }
                        case 4: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.b[b[this.ax]]);
                            this.a(this.ax, this.ay);
                            if (this.ax == this.al && this.ay == this.am) {
                                a = 0;
                            }
                            if (this.a[this.ax][this.ay][5] != 0 || this.a[this.ax][this.ay][6] != 0) break;
                            this.a[this.ax][this.ay][9] = 5;
                            if (this.ax == this.al && this.ay == this.am) {
                                a = 0;
                            }
                            this.a[this.ax][this.ay][10] = 0;
                            break;
                        }
                        case 5: {
                            this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a[b[this.ax]]);
                            this.a[this.ax][this.ay][3] = 1;
                            if (this.ax == this.al && this.ay == this.am) {
                                a = 0;
                            }
                            int[] nArray = this.a[this.ax][this.ay];
                            nArray[10] = nArray[10] + 1;
                            if (this.a[this.ax][this.ay][10] > 32) {
                                this.a[this.ax][this.ay][9] = 0;
                            }
                            this.aw = 0;
                            while (this.aw < this.av && !this.a(this.a[this.ax][this.ay][0] - 1, this.a[this.ax][this.ay][1] + this.aw)) {
                                ++this.aw;
                            }
                            this.at = this.aw;
                            this.aw = 0;
                            while (this.aw < this.av && !this.a(this.a[this.ax][this.ay][0] + 1, this.a[this.ax][this.ay][1] + this.aw)) {
                                ++this.aw;
                            }
                            this.au = this.aw;
                            if (this.at == this.au) {
                                this.a[this.ax][this.ay][9] = 0;
                            }
                            if (this.at > 0 && this.au > 0) {
                                this.a[this.ax][this.ay][9] = 0;
                            }
                            if (this.at < 0 && this.au < 0) {
                                this.a[this.ax][this.ay][9] = 0;
                            }
                            if (this.at > this.au) {
                                int[] nArray7 = this.a[this.ax][this.ay];
                                nArray7[0] = nArray7[0] - 2;
                                break;
                            }
                            int[] nArray8 = this.a[this.ax][this.ay];
                            nArray8[0] = nArray8[0] + 2;
                        }
                    }
                    this.az = 10;
                    if (this.a[this.ax][this.ay][4] < 0) {
                        this.a[this.ax][this.ay][9] = 8;
                        this.a[this.ax][this.ay][14] = -1;
                        this.a[this.ax][this.ay][15] = 0;
                        this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.j);
                    }
                    this.an = this.a[this.ax][this.ay][0];
                    this.ao = this.a[this.ax][this.ay][1];
                    this.ap = this.an;
                    this.aq = this.ao;
                    if (this.i && this.a[this.ax][this.ay][5] == 0 && !com.mnemonicstudios.novusapp.n.a.v) {
                        this.i = false;
                        this.a(this.ax, this.ay, com.mnemonicstudios.novusapp.n.a[b[this.ax]]);
                    }
                    ++this.ay;
                }
                catch (Exception exception4) {
                    exception = exception4;
                    exception4.printStackTrace();
                }
            }
            ++this.ax;
        }
    }

    public final void e() {
        switch (a) {
            case 0: {
                this.aI = 0;
            }
            case 1: {
                com.mnemonicstudios.novusapp.n.a.r = true;
                com.mnemonicstudios.novusapp.n.a.s = false;
                com.mnemonicstudios.novusapp.n.a.t = false;
                com.mnemonicstudios.novusapp.n.a.u = false;
                com.mnemonicstudios.novusapp.n.a.v = false;
                com.mnemonicstudios.novusapp.n.a.w = false;
                com.mnemonicstudios.novusapp.n.a.x = false;
                this.a[this.ax][this.ay][2] = this.aH >= 1024 && this.aH <= 3072 ? 1 : 0;
                if (this.a[this.ax][this.ay][2] == 0) {
                    if (this.ak < this.aH) {
                        a = 2;
                        this.ak = this.aH;
                    }
                } else if (this.ak > this.aH) {
                    a = 2;
                    this.ak = this.aH;
                }
                if (this.aI == this.ak) {
                    a = 2;
                    this.ak = this.aH;
                }
                this.aI = this.ak;
                return;
            }
            case 2: {
                com.mnemonicstudios.novusapp.n.a.r = false;
                com.mnemonicstudios.novusapp.n.a.s = false;
                com.mnemonicstudios.novusapp.n.a.t = false;
                com.mnemonicstudios.novusapp.n.a.u = false;
                com.mnemonicstudios.novusapp.n.a.v = true;
                if (this.ar < this.aG - 2) break;
                this.ar = this.aG;
                a = 3;
                return;
            }
            case 3: {
                com.mnemonicstudios.novusapp.n.a.r = false;
                com.mnemonicstudios.novusapp.n.a.s = false;
                com.mnemonicstudios.novusapp.n.a.t = false;
                com.mnemonicstudios.novusapp.n.a.u = false;
                com.mnemonicstudios.novusapp.n.a.v = false;
                com.mnemonicstudios.novusapp.n.a.w = false;
                com.mnemonicstudios.novusapp.n.a.x = false;
                a = 0;
            }
        }
    }

    public final void b(int n2) {
        this.e = this.b = System.currentTimeMillis();
        this.c = this.b + (long)(n2 * 1000);
        this.d = this.c - this.b;
    }

    public final void f() {
        this.b = System.currentTimeMillis();
        if (this.b - this.e > this.f) {
            this.c += this.b - this.e;
        }
        this.d = this.c - this.b;
        this.e = this.b;
    }

    public final int e() {
        return (int)(this.d / 1000L);
    }

    public final boolean a(int n2, int n3) {
        if (n2 > 1023 || n2 < 0) {
            return false;
        }
        if (n3 > 511 || n3 < 0) {
            return false;
        }
        return com.mnemonicstudios.novusapp.j.b(n2, n3) == 0;
    }

    public final int b(int n2, int n3) {
        try {
            return this.a[n2][n3][0];
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return 0;
        }
    }

    public final int c(int n2, int n3) {
        try {
            return this.a[n2][n3][1];
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return 0;
        }
    }

    public final int f() {
        return this.a[this.al][this.am & 0xF][0];
    }

    public final int g() {
        return this.a[this.al][this.am & 0xF][1];
    }

    public final int h() {
        try {
            return this.a[this.al][this.am][11];
        }
        catch (Exception exception) {
            return 0;
        }
    }

    public final void a(int n2, int n3, int n4, int n5, int n6, int n7) {
        this.j = false;
        this.Q = 0;
        this.aJ = n2;
        this.aK = n3;
        this.f[0] = n3;
        this.f[1] = n3;
        this.f[2] = n3;
        this.f[3] = n3;
        this.d[0] = n4;
        this.e[0] = 0;
        this.d[1] = n5;
        this.e[1] = 0;
        this.d[2] = n6;
        this.e[2] = 0;
        this.d[3] = n7;
        this.e[3] = 0;
    }

    public final int b(int n2, int n3, int n4, int n5) {
        this.aL = 0;
        while (this.aL < this.aJ) {
            this.aM = 0;
            while (this.aM < this.aK) {
                if ((n2 != this.aL || n3 != this.aM) && this.a[this.aL][this.aM][4] >= 0) {
                    this.aN = this.a[this.aL][this.aM][0] - 5;
                    this.aO = this.a[this.aL][this.aM][1] - 20;
                    this.aP = this.a[this.aL][this.aM][0] + 5;
                    this.aQ = this.a[this.aL][this.aM][1] + 5;
                    if (n4 > this.aN && n4 < this.aP && n5 > this.aO && n5 < this.aQ) {
                        return (this.aL << 8) + this.aM;
                    }
                }
                ++this.aM;
            }
            ++this.aL;
        }
        return -1;
    }

    public final void g() {
        if (com.mnemonicstudios.novusapp.n.a.l) {
            if (com.mnemonicstudios.novusapp.n.a.b()) {
                return;
            }
            this.j();
        }
    }

    public final void h() {
        this.f[0] = 0;
        this.f[1] = 0;
        this.f[2] = 0;
        this.f[3] = 0;
        this.aV = 0;
        this.aT = 0;
        this.aW = -1;
        this.k = false;
        this.l = false;
        this.aS = 0;
        while (this.aS < this.aJ) {
            if (!this.b[this.aS]) {
                this.aT = 0;
                while (this.aT < this.aK) {
                    if (this.a[this.aS][this.aT][4] >= 0) {
                        this.f[this.aS] = this.f[this.aS] + 1;
                    }
                    ++this.aT;
                }
            }
            if (this.f[this.aS] > 0) {
                ++this.aV;
                this.aU = this.aS;
            }
            ++this.aS;
        }
        if (com.mnemonicstudios.novusapp.n.a.l) {
            if (com.mnemonicstudios.novusapp.n.a.b()) {
                return;
            }
            this.l = true;
            this.k = true;
            if (com.mnemonicstudios.novusapp.n.a.b) {
                this.k = false;
                this.aW = this.aU;
                if (this.a[this.aW][0][4] > 0) {
                    this.aX = 0;
                }
                if (this.a[this.aW][1][4] > 0) {
                    this.aX = 1;
                }
                if (this.a[this.aW][2][4] > 0) {
                    this.aX = 2;
                }
                if (this.a[this.aW][3][4] > 0) {
                    this.aX = 3;
                    return;
                }
            }
        } else {
            if (this.aV == 0) {
                this.k = true;
                this.l = true;
            }
            if (this.aV == 1) {
                this.l = true;
                this.aW = this.aU;
                if (this.a[this.aW][0][4] > 0) {
                    this.aX = 0;
                }
                if (this.a[this.aW][1][4] > 0) {
                    this.aX = 1;
                }
                if (this.a[this.aW][2][4] > 0) {
                    this.aX = 2;
                }
                if (this.a[this.aW][3][4] > 0) {
                    this.aX = 3;
                }
            }
        }
    }

    public final void c(int n2) {
        try {
            this.aS = n2;
            this.aT = 0;
            while (this.aT < this.aK) {
                this.a[this.aS][this.aT][9] = 10;
                this.a[this.aS][this.aT][3] = com.mnemonicstudios.novusapp.n.a(4);
                ++this.aT;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void i() {
        this.aY = 7 + this.al;
        this.aZ = 11 + com.mnemonicstudios.novusapp.n.a(9);
    }

    public final void j() {
        if (com.mnemonicstudios.novusapp.n.a.b()) {
            com.mnemonicstudios.novusapp.n.a.a(3);
        }
        com.mnemonicstudios.novusapp.n.a.b();
        this.a[this.al][this.am][9] = 0;
        a = true;
        this.Q = 0;
        this.j = false;
        this.h();
        if (!this.l && !com.mnemonicstudios.novusapp.n.a.y) {
            --this.bc;
            if (this.bc < 0) {
                this.bc = 4 + com.mnemonicstudios.novusapp.n.a(6);
                com.mnemonicstudios.novusapp.n.a.o();
                return;
            }
        }
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.n.a(200) - 100);
        this.h();
        if (!this.l) {
            this.ba = 0;
            this.bb = 0;
            block0: while (this.al < this.aJ) {
                ++this.al;
                if (this.al >= this.aJ) {
                    this.al = 0;
                }
                if (this.b[this.al]) {
                    ++this.al;
                    if (this.al >= this.aJ) {
                        this.al = 0;
                    }
                }
                while (this.e[this.al] < this.aK) {
                    this.e[this.al] = this.e[this.al] + 1;
                    if (this.e[this.al] >= this.aK) {
                        this.e[this.al] = 0;
                    }
                    if (this.a[this.al][this.e[this.al]][4] > 0) {
                        this.am = this.e[this.al];
                        this.a[this.al][this.am][11] = 2;
                        this.i();
                        com.mnemonicstudios.novusapp.n.a.c();
                        return;
                    }
                    ++this.ba;
                    if (this.ba <= 100) continue;
                    ++this.bb;
                    this.ba = 0;
                    if (this.bb <= 10) continue block0;
                    this.l = true;
                    this.k = true;
                    com.mnemonicstudios.novusapp.n.a.a(this.k, this.aW, this.aX);
                    return;
                }
            }
        } else {
            if (!this.k) {
                if (com.mnemonicstudios.novusapp.n.a.l) {
                    if (com.mnemonicstudios.novusapp.n.a.b) {
                        this.c(0);
                        this.aW = 0;
                        if (this.a[0][0][4] > 0) {
                            this.aX = 0;
                        } else if (this.a[0][1][4] > 0) {
                            this.aX = 1;
                        } else if (this.a[0][2][4] > 0) {
                            this.aX = 2;
                        } else if (this.a[0][3][4] > 0) {
                            this.aX = 3;
                        }
                    } else {
                        this.c(1);
                        this.aW = 1;
                        if (this.a[1][0][4] > 0) {
                            this.aX = 0;
                        } else if (this.a[1][1][4] > 0) {
                            this.aX = 1;
                        } else if (this.a[1][2][4] > 0) {
                            this.aX = 2;
                        } else if (this.a[1][3][4] > 0) {
                            this.aX = 3;
                        }
                    }
                } else {
                    this.c(this.aW);
                }
            } else if (com.mnemonicstudios.novusapp.n.a.l) {
                if (com.mnemonicstudios.novusapp.n.a.b) {
                    this.c(0);
                    this.aW = 0;
                    if (this.a[0][0][4] > 0) {
                        this.aX = 0;
                    } else if (this.a[0][1][4] > 0) {
                        this.aX = 1;
                    } else if (this.a[0][2][4] > 0) {
                        this.aX = 2;
                    } else if (this.a[0][3][4] > 0) {
                        this.aX = 3;
                    }
                } else {
                    this.c(1);
                    this.aW = 1;
                    if (this.a[1][0][4] > 0) {
                        this.aX = 0;
                    } else if (this.a[1][1][4] > 0) {
                        this.aX = 1;
                    } else if (this.a[1][2][4] > 0) {
                        this.aX = 2;
                    } else if (this.a[1][3][4] > 0) {
                        this.aX = 3;
                    }
                }
            }
            com.mnemonicstudios.novusapp.n.a.a(this.k, this.aW, this.aX);
        }
    }

    public final void k() {
        this.be = 0;
        while (this.be < this.aJ) {
            this.bf = 0;
            while (this.bf < this.a[this.be]) {
                if (this.b[this.be]) {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.R, this.a[this.be][this.bf][0], this.a[this.be][this.bf][1] - 12, 0, 0);
                }
                if (this.h) {
                    if (this.a[this.be][this.bf][11] == 2 || this.a[this.be][this.bf][11] == 19) {
                        com.mnemonicstudios.novusapp.n.a.a(this.a[this.be][this.bf][7], this.a[this.be][this.bf][0], this.a[this.be][this.bf][1], this.a[this.be][this.bf][3], 0);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(this.a[this.be][this.bf][7], this.a[this.be][this.bf][0], this.a[this.be][this.bf][1], this.a[this.be][this.bf][3], this.a[this.be][this.bf][2]);
                    }
                } else {
                    if (this.a[this.be][this.bf][9] == 13) {
                        com.mnemonicstudios.novusapp.n.a.b(this.a[this.be][this.bf][0] + 1, this.a[this.be][this.bf][1] - 12, this.d + 1, this.e, 0x804000);
                        com.mnemonicstudios.novusapp.n.a.b(this.a[this.be][this.bf][0] - 1, this.a[this.be][this.bf][1] - 12, this.d - 1, this.e, 0x804000);
                        com.mnemonicstudios.novusapp.n.a.b(this.a[this.be][this.bf][0], this.a[this.be][this.bf][1] - 12 + 1, this.d, this.e + 1, 0x804000);
                        com.mnemonicstudios.novusapp.n.a.b(this.a[this.be][this.bf][0], this.a[this.be][this.bf][1] - 12 - 1, this.d, this.e - 1, 0x804000);
                        com.mnemonicstudios.novusapp.n.a.b(this.a[this.be][this.bf][0] + 1, this.a[this.be][this.bf][1] - 12 - 1, this.d + 1, this.e - 1, 0x804000);
                        com.mnemonicstudios.novusapp.n.a.b(this.a[this.be][this.bf][0] - 1, this.a[this.be][this.bf][1] - 12 + 1, this.d - 1, this.e + 1, 0x804000);
                    }
                    com.mnemonicstudios.novusapp.n.a.a(this.a[this.be][this.bf][7], this.a[this.be][this.bf][0], this.a[this.be][this.bf][1], this.a[this.be][this.bf][3], this.a[this.be][this.bf][2]);
                }
                ++this.bf;
            }
            ++this.be;
        }
        if (this.h) {
            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.i, this.a[this.al][this.am & 0xF][0] + this.ai, this.a[this.al][this.am & 0xF][1] + this.aj, 0, 0);
        }
        this.be = 0;
        while (this.be < this.aJ) {
            this.bf = 0;
            while (this.bf < this.a[this.be]) {
                if (this.be == this.al && this.am == this.bf && this.aR > 0) {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.h, this.a[this.be][this.bf][0], this.a[this.be][this.bf][1] - 24 - (16 - this.aR & 7), 0, 0);
                    switch (this.be) {
                        case 0: {
                            this.bg = com.mnemonicstudios.novusapp.n.G;
                            break;
                        }
                        case 1: {
                            this.bg = com.mnemonicstudios.novusapp.n.F;
                            break;
                        }
                        case 2: {
                            this.bg = com.mnemonicstudios.novusapp.n.H;
                            break;
                        }
                        case 3: {
                            this.bg = com.mnemonicstudios.novusapp.n.I;
                        }
                    }
                    if (com.mnemonicstudios.novusapp.g.ar == 0) {
                        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, this.aY, 8, 12, 20, this.bg);
                        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, this.aZ, 8, 26, 20, this.bg);
                    }
                    --this.aR;
                }
                if (this.a[this.be][this.bf][14] > 0) {
                    this.bd = this.a[this.be][this.bf][2] == 0 ? 26 : 16;
                    if (this.a[this.be][this.bf][14] < 16) {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.y, this.a[this.be][this.bf][0] + this.bd, this.a[this.be][this.bf][1] - 16, this.a[this.be][this.bf][14] >> 2, 0);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.y, this.a[this.be][this.bf][0] + this.bd, this.a[this.be][this.bf][1] - 16, 3, 0);
                        switch (com.mnemonicstudios.novusapp.j.c) {
                            case 0: {
                                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.z, this.a[this.be][this.bf][0] + this.bd, this.a[this.be][this.bf][1] - 25, this.a[this.be][this.bf][15] & 0xFFFF, 0);
                                break;
                            }
                            case 1: 
                            case 2: {
                                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.z, this.a[this.be][this.bf][0] + this.bd + 4, this.a[this.be][this.bf][1] - 25, this.a[this.be][this.bf][15] & 0xFFFF, 0);
                            }
                        }
                    }
                }
                switch (this.be) {
                    case 0: {
                        this.bg = com.mnemonicstudios.novusapp.n.G;
                        break;
                    }
                    case 1: {
                        this.bg = com.mnemonicstudios.novusapp.n.F;
                        break;
                    }
                    case 2: {
                        this.bg = com.mnemonicstudios.novusapp.n.H;
                        break;
                    }
                    case 3: {
                        this.bg = com.mnemonicstudios.novusapp.n.I;
                    }
                }
                if (this.a[this.be][this.bf][9] == 14) {
                    com.mnemonicstudios.novusapp.n.a.a((int)((this.a - System.currentTimeMillis()) / 1000L), this.a[this.be][this.bf][0] + 16, this.a[this.be][this.bf][1] - 8, com.mnemonicstudios.novusapp.n.G);
                }
                if (this.a[this.be][this.bf][4] >= 0) {
                    com.mnemonicstudios.novusapp.n.a.a(this.a[this.be][this.bf][4], this.a[this.be][this.bf][0], this.a[this.be][this.bf][1] - 24, this.bg);
                }
                if (this.a[this.be][this.bf][12] > 0) {
                    com.mnemonicstudios.novusapp.n.a.a(this.a[this.be][this.bf][13], this.a[this.be][this.bf][0], this.a[this.be][this.bf][1] - (48 - this.a[this.be][this.bf][12] * 3), com.mnemonicstudios.novusapp.n.H);
                }
                ++this.bf;
            }
            ++this.be;
        }
    }

    public final boolean a(int n2, int n3, int n4, int n5) {
        this.v = 1023 * 1023 + 511 * 511;
        this.m = false;
        try {
            this.q = 0;
            while (this.q < com.mnemonicstudios.novusapp.n.a.aJ) {
                if (this.q != n4) {
                    this.r = 0;
                    while (this.r < com.mnemonicstudios.novusapp.n.a.aK) {
                        if (com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][4] >= 0) {
                            this.s = n2 - com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][0];
                            this.t = n3 - com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][1];
                            this.u = this.s * this.s + this.t * this.t;
                            if (this.u < this.v && this.u > n5) {
                                this.v = this.u;
                                this.m = true;
                                this.bh = com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][0];
                            }
                        }
                        ++this.r;
                    }
                }
                ++this.q;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        return this.m;
    }

    public final boolean b(int n2, int n3, int n4, int n5) {
        this.m = false;
        this.bj = 0;
        this.bi = 0;
        try {
            this.q = 0;
            while (this.q < com.mnemonicstudios.novusapp.n.a.aJ) {
                if (this.q != n4) {
                    this.r = 0;
                    while (this.r < com.mnemonicstudios.novusapp.n.a.aK) {
                        if (com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][4] >= 0) {
                            this.s = n2 - com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][0];
                            this.t = n3 - com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][1];
                            this.u = this.s * this.s + this.t * this.t;
                            if (this.u < n5) {
                                this.m = true;
                                ++this.bi;
                            }
                        }
                        ++this.r;
                    }
                } else {
                    this.r = 0;
                    while (this.r < com.mnemonicstudios.novusapp.n.a.aK) {
                        if (com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][4] >= 0) {
                            this.s = n2 - com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][0];
                            this.t = n3 - com.mnemonicstudios.novusapp.n.a.a[this.q][this.r][1];
                            this.u = this.s * this.s + this.t * this.t;
                            if (this.u < n5) {
                                ++this.bj;
                            }
                        }
                        ++this.r;
                    }
                }
                ++this.q;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        if (this.bi > this.bj) {
            return this.m;
        }
        return false;
    }
}


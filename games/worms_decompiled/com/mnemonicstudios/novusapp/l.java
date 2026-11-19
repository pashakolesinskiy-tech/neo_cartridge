/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.m;
import com.mnemonicstudios.novusapp.n;
import javax.microedition.lcdui.Graphics;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class l
extends m {
    int[][][] a;
    static int a = 4;
    int[][] a;
    int[][] b;
    int b;
    int c;
    int d;
    static int e = 32;
    static int f = 24;
    static int g;
    static int h;
    static int i;
    static int j;
    int k = 0;
    int l = 34;
    int m = 0;
    int n;
    int o;
    int p;
    boolean a;
    boolean b = false;
    int q;
    int r = 0;
    int s = 0;
    int t = 0;
    int u = 0;
    int v = 0;
    boolean c;
    int w;
    int x;
    int y = 3;
    int z = 0;
    int A = -1;
    int B = -1;
    int C;
    int D;
    boolean d = false;
    int E = 3;
    int F;
    int G;
    int H;
    int I;
    int J = 0;
    boolean e = true;
    int K = 30;
    boolean f = true;
    boolean g = false;
    int[][] c = false;
    int L;
    int M = -1;
    long a = 0L;

    public l() {
        this.b = new int[10][4];
        this.c = new int[16][4];
    }

    public final void a(boolean bl) {
        this.a = bl;
        this.k = 0;
        this.l = 30;
        this.m = 0;
        this.b = 120;
        this.c = 314;
        this.E = 3;
        this.d = false;
        this.e = true;
        this.K = 30;
        this.b = false;
        this.f = true;
        com.mnemonicstudios.novusapp.n.a.a();
        this.a();
        this.M = 192;
    }

    public final void a() {
        if (!com.mnemonicstudios.novusapp.j.m) {
            com.mnemonicstudios.novusapp.n.a.l();
        }
        ++this.k;
        this.r = 24;
        if (this.a && this.k > 3) {
            this.b = true;
            this.q = 0;
        }
        if (this.l > 2) {
            this.l -= 2;
        }
        this.d();
        this.o = 0;
        while (this.o < 5) {
            this.n = 0;
            while (this.n < 6) {
                this.a[this.n][this.o][3] = 0;
                g = e + this.n * j;
                h = f + this.o * i;
                this.a[this.n][this.o][0] = g;
                this.a[this.n][this.o][1] = h;
                this.a[this.n][this.o][2] = 0;
                ++this.n;
            }
            ++this.o;
        }
        this.c();
        com.mnemonicstudios.novusapp.n.a.a();
    }

    public final void b() {
        if (this.K > 0) {
            --this.K;
            this.s = 0;
            this.t = 0;
            return;
        }
        try {
            this.a[this.s][this.t][3] = 1;
            ++this.s;
            if (this.s >= 6) {
                this.s = 0;
                ++this.t;
                if (this.t >= 5) {
                    this.f = false;
                    this.e = false;
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

    public final void c() {
        this.p = 0;
        while (this.p < 10) {
            this.a[this.p][0] = 0;
            this.a[this.p][1] = 0;
            this.a[this.p][2] = 0;
            this.b[this.p][0] = 0;
            this.b[this.p][1] = 0;
            this.b[this.p][2] = 0;
            ++this.p;
        }
    }

    public final void e() {
        if ((com.mnemonicstudios.novusapp.n.b() || com.mnemonicstudios.novusapp.n.h) && !this.b) {
            com.mnemonicstudios.novusapp.n.a.a(false);
        }
        if (this.b) {
            if (com.mnemonicstudios.novusapp.n.c()) {
                com.mnemonicstudios.novusapp.n.a.c(this.a);
            }
            ++this.q;
            return;
        }
        this.d = this.d + 1 & 3;
        if (this.e) {
            this.b();
        }
        if (this.d) {
            this.G += a;
            this.H += this.F;
            this.I += this.G;
            ++this.J;
            if (this.J > 17) {
                this.J = 0;
            }
            if (this.I > 320) {
                this.d = false;
                this.c();
            }
            return;
        }
        if (!this.f) {
            switch (this.a[this.u][this.v][3]) {
                case 1: {
                    int[] nArray = this.a[this.u][this.v];
                    nArray[0] = nArray[0] - 4;
                    if (this.a[this.u][this.v][0] <= 16) {
                        int[] nArray2 = this.a[this.u][this.v];
                        nArray2[0] = nArray2[0] + 4;
                        this.w = this.u * j;
                        this.o = 0;
                        while (this.o < 5) {
                            this.n = 0;
                            while (this.n < 6) {
                                if (this.a[this.n][this.o][3] == 1) {
                                    this.a[this.n][this.o][3] = 2;
                                    this.a[this.n][this.o][0] = 16 - this.w + this.n * j;
                                    int[] nArray3 = this.a[this.n][this.o];
                                    nArray3[1] = nArray3[1] + 8;
                                    if (this.a[this.n][this.o][1] > 296) {
                                        this.b = true;
                                        this.q = 0;
                                    }
                                }
                                ++this.n;
                            }
                            ++this.o;
                        }
                    }
                    int[] nArray4 = this.a[this.u][this.v];
                    nArray4[2] = nArray4[2] + 1;
                    if (this.a[this.u][this.v][2] <= 2) break;
                    this.a[this.u][this.v][2] = 0;
                    break;
                }
                case 2: {
                    int[] nArray = this.a[this.u][this.v];
                    nArray[0] = nArray[0] + 4;
                    if (this.a[this.u][this.v][0] >= 224) {
                        int[] nArray5 = this.a[this.u][this.v];
                        nArray5[0] = nArray5[0] - 4;
                        this.w = (6 - this.u) * j;
                        this.o = 0;
                        while (this.o < 5) {
                            this.n = 0;
                            while (this.n < 6) {
                                if (this.a[this.n][this.o][3] == 2) {
                                    this.a[this.n][this.o][3] = 1;
                                    this.a[this.n][this.o][0] = 224 + this.w - (6 - this.n) * j;
                                    int[] nArray6 = this.a[this.n][this.o];
                                    nArray6[1] = nArray6[1] + 8;
                                    if (this.a[this.n][this.o][1] > 296) {
                                        this.b = true;
                                        this.q = 0;
                                    }
                                }
                                ++this.n;
                            }
                            ++this.o;
                        }
                    }
                    int[] nArray7 = this.a[this.u][this.v];
                    nArray7[2] = nArray7[2] + 1;
                    if (this.a[this.u][this.v][2] <= 2) break;
                    this.a[this.u][this.v][2] = 0;
                }
            }
            this.c = false;
            this.x = 0;
            this.o = 0;
            while (this.o < 5) {
                this.n = 0;
                while (this.n < 6) {
                    if (this.a[this.n][this.o][3] != 0) {
                        this.c = true;
                        ++this.x;
                    }
                    ++this.n;
                }
                ++this.o;
            }
            if (this.c) {
                ++this.u;
                if (this.u >= 6) {
                    this.u = 0;
                    ++this.v;
                    if (this.v >= 5) {
                        this.v = 0;
                    }
                }
                while (this.a[this.u][this.v][3] == 0) {
                    ++this.u;
                    if (this.u < 6) continue;
                    this.u = 0;
                    ++this.v;
                    if (this.v < 5) continue;
                    this.v = 0;
                }
            } else {
                this.a();
                this.e = true;
                this.K = 30;
                this.f = true;
            }
        }
        this.o = 0;
        while (this.o < 5) {
            this.n = 0;
            while (this.n < 6) {
                switch (this.a[this.n][this.o][3]) {
                    case 5: {
                        int[] nArray = this.a[this.n][this.o];
                        nArray[5] = nArray[5] - a;
                        int[] nArray8 = this.a[this.n][this.o];
                        nArray8[0] = nArray8[0] - this.a[this.n][this.o][4];
                        int[] nArray9 = this.a[this.n][this.o];
                        nArray9[1] = nArray9[1] - this.a[this.n][this.o][5];
                        int[] nArray10 = this.a[this.n][this.o];
                        nArray10[2] = nArray10[2] + 1;
                        if (this.a[this.u][this.v][2] >= 17) {
                            this.a[this.u][this.v][2] = 0;
                        }
                        if (this.a[this.n][this.o][1] <= 344) break;
                        this.a[this.n][this.o][3] = 0;
                    }
                }
                ++this.n;
            }
            ++this.o;
        }
        this.p = 0;
        while (this.p < 10) {
            if (this.b[this.p][0] != 0) {
                int[] nArray = this.b[this.p];
                nArray[2] = nArray[2] + this.b[this.p][0];
                if (this.b[this.p][2] < 0) {
                    this.b[this.p][0] = 0;
                }
            }
            if (this.a[this.p][0] != 0) {
                int[] nArray = this.a[this.p];
                nArray[2] = nArray[2] + this.a[this.p][0];
                if (this.a[this.p][2] > 320) {
                    this.a[this.p][0] = 0;
                }
            }
            ++this.p;
        }
        this.p = 0;
        while (this.p < 10) {
            if (this.b[this.p][0] != 0) {
                this.o = 0;
                while (this.o < 5) {
                    this.n = 0;
                    while (this.n < 6) {
                        if ((this.a[this.n][this.o][3] == 1 || this.a[this.n][this.o][3] == 2) && Math.abs(this.b[this.p][1] - this.a[this.n][this.o][0]) < 16 && Math.abs(this.b[this.p][2] - this.a[this.n][this.o][1]) < 16) {
                            this.a[this.n][this.o][3] = 5;
                            this.a[this.n][this.o][4] = com.mnemonicstudios.novusapp.n.a(10) - 5;
                            this.a[this.n][this.o][5] = 20;
                            this.m += (this.o + 1) * 15;
                            this.c(this.a[this.n][this.o][0], this.a[this.n][this.o][1]);
                            this.b[this.p][0] = 0;
                        }
                        ++this.n;
                    }
                    ++this.o;
                }
            }
            this.g = false;
            if (this.a[this.p][0] != 0 && Math.abs(this.a[this.p][1] - this.b) < 16 && Math.abs(this.a[this.p][2] - this.c) < 16) {
                this.c(this.a[this.p][1], this.a[this.p][2]);
                this.a[this.p][0] = 0;
                if (!this.g) {
                    this.d = true;
                    this.g = true;
                    --this.E;
                    this.F = com.mnemonicstudios.novusapp.n.a(16) - 8;
                    this.G = -25;
                    this.H = this.b;
                    this.I = this.c - 16;
                    this.J = 0;
                    if (this.E < 1) {
                        this.q = 0;
                        this.b = true;
                    }
                }
            }
            ++this.p;
        }
        if (this.B < 0) {
            this.C = com.mnemonicstudios.novusapp.n.a(5);
            this.D = 4;
            while (this.D >= 0) {
                if (this.a[this.C][this.D][3] != 0) {
                    this.a(this.a[this.C][this.D][0], this.a[this.C][this.D][1] + 6);
                    this.B = this.l;
                    return;
                }
                --this.D;
            }
        } else {
            --this.B;
        }
        com.mnemonicstudios.novusapp.n.a.a(512);
        if (!this.d) {
            if (com.mnemonicstudios.novusapp.n.i) {
                this.b -= 4;
                if (this.b < 0) {
                    this.b = 0;
                }
            }
            if (com.mnemonicstudios.novusapp.n.j) {
                this.b += 4;
                if (this.b > 240) {
                    this.b = 240;
                }
            }
            if (com.mnemonicstudios.novusapp.n.m && this.A < 0) {
                this.b(this.b, 304);
                this.A = 16;
            }
        }
        if (this.A >= 0) {
            --this.A;
        }
    }

    public final void b(Graphics graphics) {
        com.mnemonicstudios.novusapp.j.c = 0;
        com.mnemonicstudios.novusapp.j.a = 240;
        com.mnemonicstudios.novusapp.j.b = 320;
        graphics.setClip(0, 0, 240, 320);
        com.mnemonicstudios.novusapp.n.a.a(120, 160);
        com.mnemonicstudios.novusapp.n.a.a(graphics, 0);
        this.a(graphics);
        this.o = 0;
        while (this.o < 5) {
            this.n = 0;
            while (this.n < 6) {
                switch (this.a[this.n][this.o][3]) {
                    case 1: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a[this.y], this.a[this.n][this.o][0], this.a[this.n][this.o][1], this.a[this.n][this.o][2], 1);
                        break;
                    }
                    case 2: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a[this.y], this.a[this.n][this.o][0], this.a[this.n][this.o][1], this.a[this.n][this.o][2], 0);
                        break;
                    }
                    case 3: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.c[this.y], this.a[this.n][this.o][0], this.a[this.n][this.o][1], this.a[this.n][this.o][2], 1);
                        break;
                    }
                    case 4: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.c[this.y], this.a[this.n][this.o][0], this.a[this.n][this.o][1], this.a[this.n][this.o][2], 0);
                        break;
                    }
                    case 5: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.b[this.y], this.a[this.n][this.o][0], this.a[this.n][this.o][1], this.a[this.n][this.o][2], 0);
                    }
                }
                ++this.n;
            }
            ++this.o;
        }
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a, 512, 0);
        this.p = 0;
        while (this.p < 10) {
            if (this.a[this.p][0] != 0) {
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.m, this.a[this.p][1], this.a[this.p][2] - 8 + (com.mnemonicstudios.novusapp.n.a(4) - 2), 8, 0);
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.l, this.a[this.p][1], this.a[this.p][2], 8, 0);
                com.mnemonicstudios.novusapp.j.f(this.a[this.p][1], this.a[this.p][2]);
            }
            if (this.b[this.p][0] != 0) {
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.m, this.b[this.p][1] - 1, this.b[this.p][2] + 8 - (com.mnemonicstudios.novusapp.n.a(4) - 2), 0, 0);
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.l, this.b[this.p][1], this.b[this.p][2], 0, 0);
                com.mnemonicstudios.novusapp.j.f(this.b[this.p][1], this.b[this.p][2]);
            }
            ++this.p;
        }
        if (!this.d) {
            com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a[this.z], this.b - 5, this.c - 10, this.d >> 1, 0);
        }
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.w, this.b, this.c, this.d >> 1, 0);
        if (this.d) {
            com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.b[this.z], this.H, this.I, this.J, 0);
        }
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 2, 16, 20, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.c(this.m, 24, 40, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 55, 240, 16, 24, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.c(this.E, 240 - (com.mnemonicstudios.novusapp.n.a.a(55) >> 1), 40, com.mnemonicstudios.novusapp.n.F);
        if (this.r > 0) {
            if ((this.r & 2) > 0) {
                com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 53, 120, 46, 17, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.c(this.k, 120, 70, com.mnemonicstudios.novusapp.n.F);
            }
            --this.r;
        }
        if (this.b) {
            if (this.q < 32) {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, this.q * 10);
            } else {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, 320);
                com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 120, 160, 17, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.c(this.m, 120, 184, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.a(graphics, -1, 0);
            }
        }
        this.c(graphics);
    }

    public final void a(int n2, int n3) {
        this.p = 0;
        while (this.p < 10) {
            if (this.a[this.p][0] == 0) {
                this.a[this.p][0] = 4;
                this.a[this.p][1] = n2;
                this.a[this.p][2] = n3;
                return;
            }
            ++this.p;
        }
    }

    public final void b(int n2, int n3) {
        this.p = 0;
        while (this.p < 10) {
            if (this.b[this.p][0] == 0) {
                this.b[this.p][0] = -8;
                this.b[this.p][1] = n2;
                this.b[this.p][2] = n3;
                return;
            }
            ++this.p;
        }
    }

    public final void d() {
        this.L = 0;
        while (this.L < this.c.length) {
            this.c[this.L][2] = -1;
            ++this.L;
        }
    }

    public final void c(int n2, int n3) {
        this.L = 0;
        while (this.L < this.c.length) {
            if (this.c[this.L][2] < 0) {
                this.c[this.L][0] = n2;
                this.c[this.L][1] = n3;
                this.c[this.L][2] = 0;
                return;
            }
            ++this.L;
        }
    }

    public final void a(Graphics graphics) {
        try {
            this.L = 0;
            while (this.L < this.c.length) {
                if (this.c[this.L][2] >= 0) {
                    if (this.c[this.L][2] == 1) {
                        com.mnemonicstudios.novusapp.j.h(this.c[this.L][0], this.c[this.L][1], 32);
                    }
                    if (this.c[this.L][2] < 3) {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.k, this.c[this.L][0], this.c[this.L][1] + 32, this.c[this.L][2], 0);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.k, this.c[this.L][0], this.c[this.L][1] + 32, 5 - this.c[this.L][2], 0);
                    }
                    int[] nArray = this.c[this.L];
                    nArray[2] = nArray[2] + 1;
                    if (this.c[this.L][2] > 5) {
                        this.c[this.L][2] = -1;
                    }
                }
                ++this.L;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void c(Graphics graphics) {
        if (this.b) {
            return;
        }
        if (System.currentTimeMillis() - this.a > 1000L) {
            this.M = 128;
        }
        this.a = System.currentTimeMillis();
        if (this.M < 0) {
            return;
        }
        --this.M;
        if (this.M > 32 || (this.M & 2) != 0) {
            com.mnemonicstudios.novusapp.n.a.a(graphics, 204, 284, 0, 0, 1);
            graphics.setColor(0);
            graphics.fillRect(206, 286, 24, 24);
            graphics.setColor(255, 0, 0);
            graphics.fillRect(210, 290, 5, 16);
            graphics.fillRect(221, 290, 5, 16);
        }
    }

    static {
        i = 30;
        j = 22;
    }
}


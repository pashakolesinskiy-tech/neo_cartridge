/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;
import com.mnemonicstudios.novusapp.p;
import javax.microedition.lcdui.Graphics;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class g {
    static int a = -65536;
    int b;
    int c;
    int d;
    int e;
    int f;
    int g;
    int h;
    int i;
    int j;
    boolean a;
    int[][] a = new int[4][8];
    int k;
    int l;
    public static boolean b = false;
    public static int m;
    public static int n;
    public static int o;
    public static int[] a;
    int[][] b = new int[16][4];
    int p;
    public static int[] b;
    public static int[][] c;
    public static int q;
    public static int r;
    public static int s;
    public static int t;
    public static int u;
    public static int v;
    public static int w;
    int x;
    int y;
    int z = 32768;
    int[][] d;
    int A;
    int B;
    int C;
    boolean c;
    int D;
    int E;
    int F;
    int G;
    int H;
    int I;
    boolean d = new int[5][5];
    boolean e;
    int J;
    int K;
    int L;
    int M;
    boolean f = false;
    int N;
    boolean g;
    int O;
    int P;
    int Q;
    int R;
    int S;
    int T;
    int U;
    int V;
    int W;
    int X;
    int Y;
    int Z;
    boolean h;
    int aa;
    int ab;
    int ac;
    int ad;
    int ae = 48;
    int af;
    int ag;
    int ah;
    int ai;
    int aj = 0;
    public int ak;
    public int al;
    int am;
    int an;
    boolean i;
    public boolean j = false;
    public boolean k = false;
    public boolean l = false;
    public int ao;
    public int ap;
    int aq = 0;
    static int ar;
    int as = 0;
    static boolean m;
    static boolean n;
    static boolean o;
    static boolean p;
    static boolean q;
    static boolean r;
    static boolean s;
    static boolean t;
    static boolean u;
    static boolean v;
    static boolean w;
    int at = 128;
    int au;
    int av;
    int aw;
    int ax;
    int ay;
    int az;
    int aA;
    int aB = 28;
    int aC;
    int aD;
    int aE;
    static int[][] e;
    static int[][][] a;

    public final void a() {
        this.p = 0;
        while (this.p < this.b.length) {
            this.b[this.p][2] = -1;
            ++this.p;
        }
        if (!com.mnemonicstudios.novusapp.n.a.k) {
            com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 142, 115, 93, 106, 87, 70, 20);
            com.mnemonicstudios.novusapp.j.bH = com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 100, 100, 255, 50, 50, 175, 20);
            com.mnemonicstudios.novusapp.j.bI = com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 255, 255, 0, 150, 150, 0, 20);
            com.mnemonicstudios.novusapp.j.bJ = com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 255, 60, 60, 100, 30, 30, 20);
            com.mnemonicstudios.novusapp.j.bF = com.mnemonicstudios.novusapp.n.a.a(3, 0, 8, 3, 192, 192, 192, 64, 64, 64, 20);
            com.mnemonicstudios.novusapp.j.bG = com.mnemonicstudios.novusapp.n.a.a(3, 0, 8, 3, 192, 192, 192, 64, 64, 64, 80);
            com.mnemonicstudios.novusapp.n.a.k = true;
        }
    }

    public final void a(int n2, int n3) {
        this.p = 0;
        while (this.p < this.b.length) {
            if (this.b[this.p][2] < 0) {
                this.b[this.p][0] = n2;
                this.b[this.p][1] = n3;
                this.b[this.p][2] = 0;
                return;
            }
            ++this.p;
        }
    }

    public final void a(Graphics graphics) {
        try {
            this.p = 0;
            while (this.p < this.b.length) {
                if (this.b[this.p][2] >> 0 >= 0) {
                    if (this.b[this.p][2] == 1) {
                        com.mnemonicstudios.novusapp.j.h(this.b[this.p][0], this.b[this.p][1], 32);
                    }
                    if (this.b[this.p][2] >> 0 < 3) {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.k, this.b[this.p][0], this.b[this.p][1] + 32, this.b[this.p][2] >> 0, 0);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.k, this.b[this.p][0], this.b[this.p][1] + 32, 5 - (this.b[this.p][2] >> 0), 0);
                    }
                    int[] nArray = this.b[this.p];
                    nArray[2] = nArray[2] + 1;
                    if (this.b[this.p][2] >> 0 > 5) {
                        this.b[this.p][2] = -1;
                    }
                }
                ++this.p;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void b() {
        this.x = 0;
        while (this.x < c.length) {
            if (c[this.x][w] <= 0) {
                com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.r] = com.mnemonicstudios.novusapp.n.a(480) << 16;
                com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.s] = 0x1600000;
                com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.u] = -com.mnemonicstudios.novusapp.n.a(24) << 16;
                com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.t] = 8 - com.mnemonicstudios.novusapp.n.a(16) << 15;
                this.y = com.mnemonicstudios.novusapp.n.a(b.length);
                com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.q] = b[this.y];
                com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.v] = 0;
                com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.w] = com.mnemonicstudios.novusapp.n.a(100);
            } else {
                int[] nArray = c[this.x];
                int n2 = r;
                nArray[n2] = nArray[n2] + c[this.x][t];
                int[] nArray2 = c[this.x];
                int n3 = s;
                nArray2[n3] = nArray2[n3] + c[this.x][u];
                int[] nArray3 = c[this.x];
                int n4 = u;
                nArray3[n4] = nArray3[n4] + this.z;
                int[] nArray4 = c[this.x];
                int n5 = w;
                nArray4[n5] = nArray4[n5] - 1;
                if (c[this.x][w] <= 0) {
                    this.a((c[this.x][r] >> 16) - 120, c[this.x][s] >> 16);
                }
                if (c[this.x][s] >> 16 > 384) {
                    com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.w] = 0;
                }
            }
            ++this.x;
        }
        try {
            com.mnemonicstudios.novusapp.n.a.a(511);
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public final void b(Graphics graphics) {
        com.mnemonicstudios.novusapp.n.a.a(120, 160);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a, 512, 0);
        this.x = 0;
        while (this.x < c.length) {
            try {
                switch (c[this.x][q]) {
                    case 2: 
                    case 19: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (c[this.x][r] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4) - 120, (c[this.x][s] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, 0, 20, 0);
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (c[this.x][r] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4) - 120, (c[this.x][s] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, 0, 20, 0);
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (c[this.x][r] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4) - 120, (c[this.x][s] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, 0, 20, 0);
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (c[this.x][r] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4) - 120, (c[this.x][s] >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, 0, 20, 0);
                        com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.v] = (1152 + com.mnemonicstudios.novusapp.i.a(c[this.x][t], c[this.x][u]) & 0xFFF) >> 8;
                        break;
                    }
                    case 1: 
                    case 8: 
                    case 21: 
                    case 22: {
                        int[] nArray = c[this.x];
                        int n2 = v;
                        nArray[n2] = nArray[n2] + 1;
                        if (c[this.x][v] < 16) break;
                        com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.v] = 0;
                        break;
                    }
                    case 7: {
                        int[] nArray = c[this.x];
                        int n3 = v;
                        nArray[n3] = nArray[n3] + 1;
                        if (c[this.x][v] < 6) break;
                        com.mnemonicstudios.novusapp.g.c[this.x][com.mnemonicstudios.novusapp.g.v] = 0;
                    }
                }
                switch (c[this.x][q]) {
                    case 2: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.l, (c[this.x][r] >> 16) - 120, c[this.x][s] >> 16, c[this.x][v], 0);
                        break;
                    }
                    case 19: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.o, (c[this.x][r] >> 16) - 120, c[this.x][s] >> 16, c[this.x][v], 0);
                        break;
                    }
                    case 8: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.r, (c[this.x][r] >> 16) - 120, c[this.x][s] >> 16, c[this.x][v], 0);
                        break;
                    }
                    case 1: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.n, (c[this.x][r] >> 16) - 120, c[this.x][s] >> 16, c[this.x][v], 0);
                        break;
                    }
                    case 22: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.p, (c[this.x][r] >> 16) - 120, c[this.x][s] >> 16, c[this.x][v], 0);
                        break;
                    }
                    case 11: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.l, (c[this.x][r] >> 16) - 120, c[this.x][s] >> 16, c[this.x][v], 0);
                        break;
                    }
                    case 7: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.u, (c[this.x][r] >> 16) - 120, c[this.x][s] >> 16, c[this.x][v], 0);
                    }
                }
            }
            catch (Exception exception) {}
            ++this.x;
        }
        this.a(graphics);
    }

    public final void a(int n2, int n3, int n4, int n5, int n6) {
        this.D = n3;
        this.E = n4;
        com.mnemonicstudios.novusapp.n.m = false;
        this.i = false;
        if (!this.j) {
            if (com.mnemonicstudios.novusapp.j.q) {
                return;
            }
            if (n2 == 12) {
                com.mnemonicstudios.novusapp.n.a.W = 1;
                com.mnemonicstudios.novusapp.n.a.b();
                if (a[com.mnemonicstudios.novusapp.n.a.al][n2][0] != 0) {
                    int[] nArray = a[com.mnemonicstudios.novusapp.n.a.al][n2];
                    nArray[0] = nArray[0] - 1;
                }
                return;
            }
            if (n2 == 14) {
                com.mnemonicstudios.novusapp.n.a.W = 1;
                this.g = com.mnemonicstudios.novusapp.j.i[n5];
                this.h = com.mnemonicstudios.novusapp.j.j[n5];
                com.mnemonicstudios.novusapp.n.a.e(this.g, this.h);
                if (a[com.mnemonicstudios.novusapp.n.a.al][n2][0] != 0) {
                    int[] nArray = a[com.mnemonicstudios.novusapp.n.a.al][n2];
                    nArray[0] = nArray[0] - 1;
                }
                return;
            }
            if (n2 == 13) {
                try {
                    if ((com.mnemonicstudios.novusapp.j.a[1][com.mnemonicstudios.novusapp.n.a.a() >> 5][com.mnemonicstudios.novusapp.n.a.b() >> 5] >> 8 & 0xF) == 0) {
                        com.mnemonicstudios.novusapp.j.a[3][com.mnemonicstudios.novusapp.n.a.a() >> 5][com.mnemonicstudios.novusapp.n.a.b() >> 5] = 1;
                        com.mnemonicstudios.novusapp.n.a(10);
                        this.B = com.mnemonicstudios.novusapp.n.a.a() & 0xFFFFFFE0;
                        this.C = (com.mnemonicstudios.novusapp.n.a.b() & 0xFFFFFFE0) + 12;
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C);
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C + 1);
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C + 2);
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C + 3);
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C + 4);
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C + 5);
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C + 6);
                        com.mnemonicstudios.novusapp.j.f(this.B, this.B + 32, this.C + 7);
                        com.mnemonicstudios.novusapp.n.a.a[com.mnemonicstudios.novusapp.n.a.al][com.mnemonicstudios.novusapp.n.a.am][11] = 2;
                        com.mnemonicstudios.novusapp.n.a.W = 1;
                        com.mnemonicstudios.novusapp.n.a.Q = 16;
                        com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
                        if (a[com.mnemonicstudios.novusapp.n.a.al][n2][0] != 0) {
                            int[] nArray = a[com.mnemonicstudios.novusapp.n.a.al][n2];
                            nArray[0] = nArray[0] - 1;
                        }
                    }
                    return;
                }
                catch (Exception exception) {
                    return;
                }
            }
            if (n2 == 9) {
                com.mnemonicstudios.novusapp.n.a.W = 1;
                com.mnemonicstudios.novusapp.n.a.j(m, n);
                com.mnemonicstudios.novusapp.n.a(-1);
                if (a[com.mnemonicstudios.novusapp.n.a.al][n2][0] != 0) {
                    int[] nArray = a[com.mnemonicstudios.novusapp.n.a.al][n2];
                    nArray[0] = nArray[0] - 1;
                }
                return;
            }
            if (n2 == 17) {
                this.d(n3, n4);
                return;
            }
            if (a[com.mnemonicstudios.novusapp.n.a.al][n2][0] != 0) {
                int[] nArray = a[com.mnemonicstudios.novusapp.n.a.al][n2];
                nArray[0] = nArray[0] - 1;
            }
            this.b = n2;
            switch (this.b) {
                case 2: {
                    com.mnemonicstudios.novusapp.n.a(6);
                    break;
                }
                case 19: {
                    com.mnemonicstudios.novusapp.n.a(-1);
                    break;
                }
                case 6: {
                    com.mnemonicstudios.novusapp.n.a(11);
                    break;
                }
                case 1: 
                case 8: 
                case 21: {
                    break;
                }
                case 20: {
                    com.mnemonicstudios.novusapp.n.a(0);
                    break;
                }
                case 7: {
                    com.mnemonicstudios.novusapp.n.a(3);
                }
            }
        }
        this.b = n2;
        this.H = 0;
        this.a = false;
        this.i = n3 << 16;
        this.j = n4 << 16;
        this.e = n6;
        this.c = n3;
        this.d = n4;
        this.f = 80;
        switch (this.b) {
            case 11: {
                this.g = 0;
                this.h = 0;
                this.f = false;
                return;
            }
            case 5: {
                this.g = 0;
                this.h = 0;
                this.A = 0;
                while (this.A < this.d.length) {
                    this.d[this.A][0] = n3 + (this.A << 4) - 32;
                    this.d[this.A][1] = n4 - com.mnemonicstudios.novusapp.n.a(64);
                    this.d[this.A][2] = 0;
                    this.d[this.A][3] = 0;
                    this.d[this.A][4] = com.mnemonicstudios.novusapp.n.a(3);
                    this.c = false;
                    ++this.A;
                }
                this.f = false;
                return;
            }
            case 18: {
                this.g = 100 * com.mnemonicstudios.novusapp.j.i[n5] >> 3;
                this.h = 100 * com.mnemonicstudios.novusapp.j.j[n5] >> 3;
                this.f = false;
                return;
            }
            case 1: 
            case 2: 
            case 6: 
            case 8: 
            case 10: 
            case 19: 
            case 20: 
            case 21: 
            case 22: {
                this.g = this.e * com.mnemonicstudios.novusapp.j.i[n5] >> 3;
                this.h = this.e * com.mnemonicstudios.novusapp.j.j[n5] >> 3;
                this.f = false;
                return;
            }
            case 7: {
                this.f = 160;
                this.H = 0;
                if (n5 > 1024 && n5 < 3072) {
                    this.g = 150 * com.mnemonicstudios.novusapp.j.i[n5] >> 5;
                    this.h = 150 * com.mnemonicstudios.novusapp.j.j[n5] >> 3;
                    return;
                }
                this.g = 150 * com.mnemonicstudios.novusapp.j.i[n5] >> 5;
                this.h = 150 * com.mnemonicstudios.novusapp.j.j[n5] >> 3;
                return;
            }
            case 3: {
                com.mnemonicstudios.novusapp.n.a(1);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n4 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n4 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n4 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n4 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                this.g = 500 * com.mnemonicstudios.novusapp.j.i[n5] >> 3;
                this.h = 500 * com.mnemonicstudios.novusapp.j.j[n5] >> 3;
                this.f = false;
            }
        }
    }

    public final boolean a() {
        switch (this.b) {
            case 2: 
            case 5: 
            case 11: 
            case 19: {
                return false;
            }
            case 1: 
            case 6: 
            case 7: 
            case 8: 
            case 20: 
            case 21: 
            case 22: {
                return true;
            }
        }
        return false;
    }

    public final int a(int n2) {
        switch (n2) {
            case 2: {
                return 24;
            }
            case 5: 
            case 11: 
            case 19: {
                return 12;
            }
            case 8: {
                return 12;
            }
            case 21: {
                return 24;
            }
            case 1: {
                return 24;
            }
            case 20: 
            case 22: {
                return 24;
            }
            case 6: {
                return 32;
            }
            case 7: {
                return 16;
            }
            case 3: {
                return 16;
            }
        }
        return 16;
    }

    public final void b(int n2, int n3) {
        com.mnemonicstudios.novusapp.n.a.b(n2, n3, this.g, this.h);
        com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
        com.mnemonicstudios.novusapp.n.a.W = 1;
    }

    public final void c() {
        if ((this.b == 22 || this.b == 20 || this.b == 6) && this.f) {
            this.b(this.L, this.M);
            this.c = this.L;
            this.d = this.M;
            return;
        }
        this.F = this.i >> 16;
        this.G = this.j >> 16;
        if (this.b != 18 && this.b != 3) {
            this.h -= a;
        }
        this.i += this.g;
        this.j += this.h;
        this.c = this.i >> 16;
        this.d = this.j >> 16;
        if (this.c < -511 || this.d < -511 || this.c >= 1280 || this.d >= 504) {
            if (this.j) {
                this.k = true;
            } else {
                com.mnemonicstudios.novusapp.n.a.W = 1;
                com.mnemonicstudios.novusapp.n.a.Q = 16;
                com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
            }
        }
        this.I = 0;
        switch (this.b) {
            case 3: {
                if (this.a(this.F, this.G, this.c, this.d - 48)) {
                    this.f(this.ak, this.al);
                }
                if (this.a(this.F, this.G, this.c, this.d + 48)) {
                    this.f(this.ak, this.al);
                }
                if (this.a(this.F, this.G, this.c, this.d - 16)) {
                    this.f(this.ak, this.al);
                }
                if (this.a(this.F, this.G, this.c, this.d + 16)) {
                    this.f(this.ak, this.al);
                }
                if (this.a(this.F, this.G, this.c, this.d)) {
                    this.f(this.ak, this.al);
                }
                this.d(this.F, this.G);
                return;
            }
            case 18: {
                if (!this.a(this.F, this.G, this.c, this.d)) break;
                this.b(this.ak, this.al);
                return;
            }
            case 11: {
                if (com.mnemonicstudios.novusapp.n.k || com.mnemonicstudios.novusapp.n.l || com.mnemonicstudios.novusapp.n.i || com.mnemonicstudios.novusapp.n.j) {
                    this.e(this.c, this.d);
                }
                if (this.a(this.F, this.G, this.c, this.d)) {
                    this.f(this.ak, this.al);
                    this.h = -786432;
                }
                if (this.d < 511) break;
                this.d(this.ak, this.al);
                return;
            }
            case 5: {
                this.c = true;
                this.A = 0;
                while (this.A < this.d.length) {
                    if (this.d[this.A][4] >= 0) {
                        this.c = false;
                        this.d[this.A][4] = this.d[this.A][4] + 1;
                        if (this.d[this.A][4] > 2) {
                            this.d[this.A][4] = 0;
                        }
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, this.d[this.A][0], this.d[this.A][1], 0, 0, 20, 0);
                        int[] nArray = this.d[this.A];
                        nArray[3] = nArray[3] + 1;
                        if (this.d[this.A][3] > 12 + com.mnemonicstudios.novusapp.n.a(2)) {
                            this.d[this.A][3] = 12 + com.mnemonicstudios.novusapp.n.a(4);
                        }
                        this.d = this.d[this.A][1];
                        this.j = this.d << 16;
                        int[] nArray2 = this.d[this.A];
                        nArray2[1] = nArray2[1] + this.d[this.A][3];
                        if (this.a(this.d[this.A][0], this.d[this.A][1] - this.d[this.A][3], this.d[this.A][0], this.d[this.A][1])) {
                            this.d[this.A][4] = -1;
                            this.f(this.ak, this.al);
                        }
                    }
                    ++this.A;
                }
                if (!this.c) break;
                this.d(this.c, this.d);
                return;
            }
            case 2: {
                this.g += com.mnemonicstudios.novusapp.n.a.a() << 9;
                this.H = (1152 + com.mnemonicstudios.novusapp.i.a(this.c - this.F, this.d - this.G) & 0xFFF) >> 8;
                if (!this.a(this.c, this.d) && this.a(this.F, this.G, this.c, this.d)) {
                    this.e(this.ak, this.al);
                    return;
                }
                if (this.i) {
                    this.e(this.c, this.d);
                }
                if (this.j) break;
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, this.F + (com.mnemonicstudios.novusapp.n.a(8) - 4), this.G + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, this.F + (com.mnemonicstudios.novusapp.n.a(8) - 4), this.G + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, this.F + (com.mnemonicstudios.novusapp.n.a(8) - 4), this.G + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, this.F + (com.mnemonicstudios.novusapp.n.a(8) - 4), this.G + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
                return;
            }
            case 8: {
                if (!this.a) {
                    if (this.a(this.F, this.G, this.c, this.d)) {
                        this.J = this.c - this.F;
                        this.K = this.d - this.G;
                        this.d = false;
                        this.e = false;
                        if (this.a(this.F, this.G, this.F + this.J, this.G)) {
                            this.g = -this.g + (16 - com.mnemonicstudios.novusapp.n.a(32) << 10);
                            this.d = true;
                        }
                        if (this.a(this.F, this.G, this.F, this.G + this.K)) {
                            this.h = -this.h;
                            this.d = true;
                        }
                        if (!this.d && !this.e) {
                            this.g = -this.g + (16 - com.mnemonicstudios.novusapp.n.a(32) << 10);
                            this.h = -this.h;
                        }
                        this.g = (this.g >> 1) + (this.g >> 2);
                        this.h = (this.h >> 1) + (this.h >> 2);
                        this.c = this.F;
                        this.d = this.G;
                        this.i = this.F << 16;
                        this.j = this.G << 16;
                        if (!this.j) {
                            com.mnemonicstudios.novusapp.n.a(-1);
                        }
                    }
                    if (Math.abs(this.h) > 65536) {
                        this.H = this.H + 1 & 0xF;
                    }
                    if (!com.mnemonicstudios.novusapp.n.f) {
                        --this.f;
                    }
                    if (this.f < 0 && !this.a) {
                        this.f(this.c, this.d);
                        this.a = true;
                        this.c(this.c, this.d);
                        this.k = this.c;
                        this.l = this.d;
                    }
                }
                if (!this.a) break;
                this.g = false;
                this.N = 0;
                while (this.N < this.a.length) {
                    if (this.a[this.N][4] > 0) {
                        this.g = true;
                        this.a[this.N][5] = this.a[this.N][5] + 1 & 0xF;
                        this.a[this.N][6] = this.a[this.N][0];
                        this.a[this.N][7] = this.a[this.N][1];
                        int[] nArray = this.a[this.N];
                        nArray[0] = nArray[0] + this.a[this.N][2];
                        int[] nArray3 = this.a[this.N];
                        nArray3[1] = nArray3[1] + this.a[this.N][3];
                        int[] nArray4 = this.a[this.N];
                        nArray4[3] = nArray4[3] - a;
                        if (this.a(this.a[this.N][6] >> 16, this.a[this.N][7] >> 16, this.a[this.N][0] >> 16, this.a[this.N][1] >> 16)) {
                            this.a[this.N][4] = -1;
                            this.f(this.a[this.N][0] >> 16, this.a[this.N][1] >> 16);
                        }
                        if (this.a[this.N][0] >> 16 < -256 || this.a[this.N][1] >> 16 < -256 || this.a[this.N][0] >> 16 >= 1280 || this.a[this.N][1] >> 16 >= 768) {
                            this.a[this.N][4] = -1;
                        }
                    }
                    ++this.N;
                }
                if (!this.g) {
                    if (this.j) {
                        this.ao = this.k;
                        this.ap = this.l;
                        this.l = true;
                    } else {
                        com.mnemonicstudios.novusapp.n.a.W = 1;
                        com.mnemonicstudios.novusapp.n.a.Q = 32;
                        com.mnemonicstudios.novusapp.n.a.k(this.c, this.d, 32);
                    }
                }
                this.c = this.k;
                this.d = this.l;
                this.i = this.k << 16;
                this.j = this.l << 16;
                this.g = 0;
                this.h = 0;
                return;
            }
            case 7: {
                if (com.mnemonicstudios.novusapp.n.m) {
                    this.f = -1;
                }
                if (this.a(this.F, this.G, this.c, this.d)) {
                    this.J = this.c - this.F;
                    this.K = this.d - this.G;
                    this.d = false;
                    this.e = false;
                    if (this.a(this.F, this.G, this.F + this.J, this.G)) {
                        this.g = -this.g;
                        this.d = true;
                    }
                    if (this.a(this.F, this.G, this.F, this.G + this.K)) {
                        this.h = -this.h;
                        this.e = true;
                    }
                    if (!this.d && !this.e) {
                        this.g = -this.g;
                        this.h = -this.h;
                    }
                    this.c = this.F;
                    this.d = this.G;
                    this.i = this.F << 16;
                    this.j = this.G << 16;
                    if (!this.j) {
                        com.mnemonicstudios.novusapp.n.a(3);
                    }
                }
                if (this.a(this.c, this.d)) {
                    this.e(this.c, this.d);
                    return;
                }
                ++this.H;
                if (this.H >= 6) {
                    this.H = 0;
                }
                this.I = this.g > 0 ? 1 : 0;
                if (!com.mnemonicstudios.novusapp.n.f) {
                    --this.f;
                }
                if (this.f >= 0) break;
                this.e(this.c, this.d);
                return;
            }
            case 1: 
            case 21: {
                if (this.a(this.F, this.G, this.c, this.d)) {
                    this.J = this.c - this.F;
                    this.K = this.d - this.G;
                    this.d = false;
                    this.e = false;
                    if (this.a(this.F, this.G, this.F + this.J, this.G)) {
                        this.g = -(this.g >> 1) + (16 - com.mnemonicstudios.novusapp.n.a(32) << 10);
                        this.d = true;
                    }
                    if (this.a(this.F, this.G, this.F, this.G + this.K)) {
                        this.h = -(this.h >> 1);
                        this.d = true;
                    }
                    if (!this.d && !this.e) {
                        this.g = -(this.g >> 1) + (16 - com.mnemonicstudios.novusapp.n.a(32) << 10);
                        this.h = -(this.h >> 1);
                    }
                    this.c = this.F;
                    this.d = this.G;
                    this.i = this.F << 16;
                    this.j = this.G << 16;
                    if (!this.j) {
                        com.mnemonicstudios.novusapp.n.a(-1);
                    }
                }
                if (Math.abs(this.h) > 65536) {
                    this.H = this.H + 1 & 0xF;
                }
                if (!com.mnemonicstudios.novusapp.n.f) {
                    --this.f;
                }
                if (this.f >= 0) break;
                this.e(this.c, this.d);
                return;
            }
            case 19: {
                this.g += com.mnemonicstudios.novusapp.n.a.a() << 9;
                this.H = (1152 + com.mnemonicstudios.novusapp.i.a(this.c - this.F, this.d - this.G) & 0xFFF) >> 8;
                this.a(this.c, this.d);
                if (!this.a(this.F, this.G, this.c, this.d)) break;
                this.e(this.ak, this.al);
                return;
            }
            case 20: {
                if (this.f) {
                    this.b(this.ak, this.al);
                    return;
                }
                this.H = this.H + 1 & 0xF;
                if (!this.a(this.F, this.G, this.c, this.d)) break;
                if (this.j) {
                    this.ao = this.ak;
                    this.ap = this.al;
                    this.l = true;
                    return;
                }
                com.mnemonicstudios.novusapp.n.a.b(6, this.ak, this.al);
                this.f = true;
                this.L = this.ak;
                this.M = this.al;
                return;
            }
            case 6: {
                if (this.f) {
                    this.b(this.ak, this.al);
                    return;
                }
                this.H = this.H + 1 & 0xF;
                if (!this.a(this.F, this.G, this.c, this.d)) break;
                if (this.j) {
                    this.ao = this.ak;
                    this.ap = this.al;
                    this.l = true;
                    return;
                }
                com.mnemonicstudios.novusapp.n.a.b(10, this.ak, this.al);
                this.f = true;
                this.L = this.ak;
                this.M = this.al;
                return;
            }
            case 22: {
                if (this.f) {
                    this.b(this.ak, this.al);
                    return;
                }
                this.H = this.H + 1 & 0xF;
                if (!this.a(this.F, this.G, this.c, this.d)) break;
                if (this.j) {
                    this.ao = this.ak;
                    this.ap = this.al;
                    this.l = true;
                    return;
                }
                com.mnemonicstudios.novusapp.n.a.b(0, this.ak, this.al);
                this.f = true;
                this.L = this.ak;
                this.M = this.al;
            }
        }
    }

    public final void c(int n2, int n3) {
        this.N = 0;
        while (this.N < this.a.length) {
            this.a[this.N][0] = (com.mnemonicstudios.novusapp.n.a(4) - 2 << 15) + (n2 << 16);
            this.a[this.N][1] = n3 - (32 + com.mnemonicstudios.novusapp.n.a(16)) << 16;
            this.a[this.N][2] = 131072 - (com.mnemonicstudios.novusapp.n.a(4) << 16);
            this.a[this.N][3] = (com.mnemonicstudios.novusapp.n.a(4) - 4 << 16) + -655360;
            this.a[this.N][4] = 60;
            this.a[this.N][5] = com.mnemonicstudios.novusapp.n.a(16);
            this.a[this.N][6] = this.a[this.N][0];
            this.a[this.N][7] = this.a[this.N][1];
            ++this.N;
        }
    }

    public final boolean a(int n2, int n3) {
        if (!this.j && com.mnemonicstudios.novusapp.n.a.b(-1, -1, n2, n3) > 0) {
            this.e(n2, n3);
            return true;
        }
        return false;
    }

    public final boolean b(int n2, int n3) {
        if (!this.j) {
            if (com.mnemonicstudios.novusapp.j.a < System.currentTimeMillis()) {
                com.mnemonicstudios.novusapp.n.a.W = 1;
                com.mnemonicstudios.novusapp.n.a.Q = 32;
                com.mnemonicstudios.novusapp.n.a.k(n2, n3, 32);
                return true;
            }
            return false;
        }
        this.ao = n2;
        this.ap = n3;
        this.l = true;
        return false;
    }

    public final void d(int n2, int n3) {
        if (this.j) {
            this.ao = n2;
            this.ap = n3;
            this.l = true;
            return;
        }
        com.mnemonicstudios.novusapp.n.a.W = 1;
        com.mnemonicstudios.novusapp.n.a.Q = 32;
        com.mnemonicstudios.novusapp.n.a.k(n2, n3, 32);
        com.mnemonicstudios.novusapp.n.a.C = 128;
    }

    public final void e(int n2, int n3) {
        if (this.j) {
            this.ao = n2;
            this.ap = n3;
            this.l = true;
            return;
        }
        this.O = this.a(this.b);
        com.mnemonicstudios.novusapp.n.a.g(n2, n3, this.O);
        com.mnemonicstudios.novusapp.n.a(1);
        com.mnemonicstudios.novusapp.n.a.a(16);
        com.mnemonicstudios.novusapp.n.a.b(n2, n3, this.O);
        com.mnemonicstudios.novusapp.n.a.W = 1;
        com.mnemonicstudios.novusapp.n.a.Q = 32;
        com.mnemonicstudios.novusapp.n.a.k(n2, n3, 32);
    }

    public final void f(int n2, int n3) {
        if (this.j) {
            return;
        }
        com.mnemonicstudios.novusapp.n.a.g(n2, n3, 24);
        com.mnemonicstudios.novusapp.n.a(1);
        com.mnemonicstudios.novusapp.n.a.a(16);
        com.mnemonicstudios.novusapp.n.a.b(n2, n3, 24);
    }

    public final boolean a(int n2, int n3, int n4, int n5) {
        try {
            this.aj = 0;
            this.h = this.c(n2, n3);
            if (!this.h) {
                this.aa = n2;
                this.ab = n3;
                this.aj = 1;
            }
            if (n3 >= 511) {
                this.ak = n2;
                this.al = 511;
                return true;
            }
            if (n5 >= 511) {
                this.ak = n4;
                this.al = 511;
                return true;
            }
            if (n2 < 0 || n2 >= 1023) {
                return false;
            }
            if (n4 < 0 || n4 >= 1023) {
                return false;
            }
            if (n3 < 0 || n5 < 0) {
                return false;
            }
            this.am = n4 - n2;
            this.an = n5 - n3;
            if (this.am == 0 && this.an == 0) {
                this.aj |= 2;
                if (this.h) {
                    if (!this.c(n2 + 1, n3)) {
                        this.ak = n2 + 1;
                        this.al = n3;
                        return true;
                    }
                    if (!this.c(n2 - 1, n3)) {
                        this.ak = n2 - 1;
                        this.al = n3;
                        return true;
                    }
                    if (!this.c(n2, n3 + 1)) {
                        this.ak = n2;
                        this.al = n3 + 1;
                        return true;
                    }
                    if (!this.c(n2, n3 - 1)) {
                        this.ak = n2;
                        this.al = n3 - 1;
                        return true;
                    }
                    if (!this.c(n2 + 1, n3 + 1)) {
                        this.ak = n2 + 1;
                        this.al = n3 + 1;
                        return true;
                    }
                    if (!this.c(n2 + 1, n3 - 1)) {
                        this.ak = n2 + 1;
                        this.al = n3 - 1;
                        return true;
                    }
                    if (!this.c(n2 - 1, n3 + 1)) {
                        this.ak = n2 - 1;
                        this.al = n3 + 1;
                        return true;
                    }
                    if (!this.c(n2 - 1, n3 - 1)) {
                        this.ak = n2 - 1;
                        this.al = n3 - 1;
                        return true;
                    }
                    if (!this.j) {
                        this.af = this.ae;
                        this.ag = this.ae;
                        this.ah = this.ae;
                        this.ai = this.ae;
                        this.ad = 0;
                        while (this.ad < this.ae) {
                            if (!this.c(n2, n3 - this.ad)) {
                                this.af = this.ad;
                                break;
                            }
                            ++this.ad;
                        }
                        this.ad = 0;
                        while (this.ad < this.ae) {
                            if (!this.c(n2, n3 + this.ad)) {
                                this.ag = this.ad;
                                break;
                            }
                            ++this.ad;
                        }
                        this.ac = 0;
                        while (this.ac < this.ae) {
                            if (!this.c(n2 - this.ac, n3)) {
                                this.ah = this.ac;
                                break;
                            }
                            ++this.ac;
                        }
                        this.ac = 0;
                        while (this.ac < this.ae) {
                            if (!this.c(n2 + this.ac, n3)) {
                                this.ai = this.ac;
                                break;
                            }
                            ++this.ac;
                        }
                        if (this.af == this.ae && this.ag == this.ae && this.ah == this.ae && this.ai == this.ae) {
                            this.ad = 0;
                            while (this.ad < 511) {
                                if (!this.c(n2, n3 - this.ad)) {
                                    this.ak = n2;
                                    this.al = n3 - this.ad;
                                    return true;
                                }
                                ++this.ad;
                            }
                        } else {
                            if (this.af <= this.ag && this.af <= this.ah && this.af <= this.ai) {
                                this.ak = n2;
                                this.al = n3 - this.af;
                                return true;
                            }
                            if (this.ag <= this.af && this.ag <= this.ah && this.ag <= this.ai) {
                                this.ak = n2;
                                this.al = n3 + this.ag;
                                return true;
                            }
                            if (this.ah <= this.ag && this.ah <= this.af && this.ah <= this.ai) {
                                this.ak = n2 - this.ah;
                                this.al = n3;
                                return true;
                            }
                            if (this.ai <= this.ag && this.ai <= this.ah && this.ai <= this.af) {
                                this.ak = n2 + this.ai;
                                this.al = n3;
                                return true;
                            }
                        }
                    }
                } else if (this.c(n2, n3)) {
                    this.ak = n2;
                    this.al = n3;
                    return true;
                }
                return false;
            }
            if (this.am == 0) {
                this.aj |= 4;
                this.W = this.an > 0 ? 1 : -1;
                this.T = n3;
                this.Z = 0;
                while (this.T != n5 && this.Z < 200) {
                    if (this.c(n2, this.T) != this.h) {
                        if (!this.h) {
                            this.al = this.ab;
                            this.ak = this.aa;
                            this.aj |= 0x100;
                        } else {
                            this.ak = n2;
                            this.al = this.T;
                            this.aj |= 0x200;
                        }
                        return true;
                    }
                    if (!this.h) {
                        this.aa = n2;
                        this.ab = n3;
                    }
                    this.T += this.W;
                    ++this.Z;
                }
                if (!this.j && this.h) {
                    this.af = this.ae;
                    this.ag = this.ae;
                    this.ah = this.ae;
                    this.ai = this.ae;
                    this.ad = 0;
                    while (this.ad < this.ae) {
                        if (!this.c(n2, n3 - this.ad)) {
                            this.af = this.ad;
                            break;
                        }
                        ++this.ad;
                    }
                    this.ad = 0;
                    while (this.ad < this.ae) {
                        if (!this.c(n2, n3 + this.ad)) {
                            this.ag = this.ad;
                            break;
                        }
                        ++this.ad;
                    }
                    this.ac = 0;
                    while (this.ac < this.ae) {
                        if (!this.c(n2 - this.ac, n3)) {
                            this.ah = this.ac;
                            break;
                        }
                        ++this.ac;
                    }
                    this.ac = 0;
                    while (this.ac < this.ae) {
                        if (!this.c(n2 + this.ac, n3)) {
                            this.ai = this.ac;
                            break;
                        }
                        ++this.ac;
                    }
                    if (this.af == this.ae && this.ag == this.ae && this.ah == this.ae && this.ai == this.ae) {
                        this.ad = 0;
                        while (this.ad < 511) {
                            if (!this.c(n2, n3 - this.ad)) {
                                this.ak = n2;
                                this.al = n3 - this.ad;
                                return true;
                            }
                            ++this.ad;
                        }
                    } else {
                        if (this.af <= this.ag && this.af <= this.ah && this.af <= this.ai) {
                            this.ak = n2;
                            this.al = n3 - this.af;
                            return true;
                        }
                        if (this.ag <= this.af && this.ag <= this.ah && this.ag <= this.ai) {
                            this.ak = n2;
                            this.al = n3 + this.ag;
                            return true;
                        }
                        if (this.ah <= this.ag && this.ah <= this.af && this.ah <= this.ai) {
                            this.ak = n2 - this.ah;
                            this.al = n3;
                            return true;
                        }
                        if (this.ai <= this.ag && this.ai <= this.ah && this.ai <= this.af) {
                            this.ak = n2 + this.ai;
                            this.al = n3;
                            return true;
                        }
                    }
                }
                return false;
            }
            if (this.an == 0) {
                this.aj |= 8;
                this.V = this.am > 0 ? 1 : -1;
                this.U = n2;
                this.Z = 0;
                while (this.U != n4 && this.Z < 200) {
                    if (this.c(this.U, n3) != this.h) {
                        if (!this.h) {
                            this.al = this.ab;
                            this.ak = this.aa;
                            this.aj |= 0x10000;
                        } else {
                            this.ak = this.U;
                            this.al = n3;
                            this.aj |= 0x20000;
                        }
                        return true;
                    }
                    if (!this.h) {
                        this.aa = n2;
                        this.ab = n3;
                    }
                    ++this.Z;
                }
                if (!this.j && this.h) {
                    this.af = this.ae;
                    this.ag = this.ae;
                    this.ah = this.ae;
                    this.ai = this.ae;
                    this.ad = 0;
                    while (this.ad < this.ae) {
                        if (!this.c(n2, n3 - this.ad)) {
                            this.af = this.ad;
                            break;
                        }
                        ++this.ad;
                    }
                    this.ad = 0;
                    while (this.ad < this.ae) {
                        if (!this.c(n2, n3 + this.ad)) {
                            this.ag = this.ad;
                            break;
                        }
                        ++this.ad;
                    }
                    this.ac = 0;
                    while (this.ac < this.ae) {
                        if (!this.c(n2 - this.ac, n3)) {
                            this.ah = this.ac;
                            break;
                        }
                        ++this.ac;
                    }
                    this.ac = 0;
                    while (this.ac < this.ae) {
                        if (!this.c(n2 + this.ac, n3)) {
                            this.ai = this.ac;
                            break;
                        }
                        ++this.ac;
                    }
                    if (this.af == this.ae && this.ag == this.ae && this.ah == this.ae && this.ai == this.ae) {
                        this.ad = 0;
                        while (this.ad < 511) {
                            if (!this.c(n2, n3 - this.ad)) {
                                this.ak = n2;
                                this.al = n3 - this.ad;
                                return true;
                            }
                            ++this.ad;
                        }
                    } else {
                        if (this.af <= this.ag && this.af <= this.ah && this.af <= this.ai) {
                            this.ak = n2;
                            this.al = n3 - this.af;
                            return true;
                        }
                        if (this.ag <= this.af && this.ag <= this.ah && this.ag <= this.ai) {
                            this.ak = n2;
                            this.al = n3 + this.ag;
                            return true;
                        }
                        if (this.ah <= this.ag && this.ah <= this.af && this.ah <= this.ai) {
                            this.ak = n2 - this.ah;
                            this.al = n3;
                            return true;
                        }
                        if (this.ai <= this.ag && this.ai <= this.ah && this.ai <= this.af) {
                            this.ak = n2 + this.ai;
                            this.al = n3;
                            return true;
                        }
                    }
                }
                return false;
            }
            if (Math.abs(this.an) > Math.abs(this.am)) {
                this.aj |= 0x10;
                this.X = (this.am << 16) / this.an;
                if (this.an > 0) {
                    this.W = 1;
                } else {
                    this.W = -1;
                    this.X = -this.X;
                }
                this.P = n2 << 16;
                this.Q = n2 << 16;
                this.T = n3;
                this.Y = 0;
                this.Z = 0;
                while (this.T != n5 && this.Y < 200) {
                    this.Z = 0;
                    while (this.P >> 16 == this.Q >> 16 && this.Z < 200 && this.T != n5) {
                        if (this.c(this.P >> 16, this.T) != this.h) {
                            if (!this.h) {
                                this.al = this.ab;
                                this.ak = this.aa;
                            } else {
                                this.ak = this.P >> 16;
                                this.al = this.T;
                            }
                            return true;
                        }
                        if (!this.h) {
                            this.aa = this.P >> 16;
                            this.ab = this.T;
                        }
                        ++this.Z;
                        this.P += this.X;
                        this.T += this.W;
                        if (!(n2 > n4 ? this.P >> 16 < n4 && this.an < 0 && this.am < 0 : this.P >> 16 > n4 && this.an < 0 && this.am < 0)) continue;
                    }
                    this.Q = this.P;
                    ++this.Y;
                }
                if (this.Y > 190) {
                    // empty if block
                }
            } else {
                this.aj |= 0x20;
                this.X = (this.an << 16) / this.am;
                if (this.am > 0) {
                    this.V = 1;
                } else {
                    this.V = -1;
                    this.X = -this.X;
                }
                this.R = n3 << 16;
                this.S = n3 << 16;
                this.U = n2;
                this.Y = 0;
                this.Z = 0;
                while (this.U != n4 && this.Y < 200) {
                    this.Z = 0;
                    while (this.R >> 16 == this.S >> 16 && this.Z < 200 && this.U != n4) {
                        if (this.c(this.U, this.R >> 16) != this.h) {
                            if (!this.h) {
                                this.al = this.ab;
                                this.ak = this.aa;
                            } else {
                                this.al = this.R >> 16;
                                this.ak = this.U;
                            }
                            return true;
                        }
                        if (!this.h) {
                            this.ab = this.R >> 16;
                            this.aa = this.U;
                        }
                        ++this.Z;
                        this.R += this.X;
                        this.U += this.V;
                    }
                    this.S = this.R;
                    ++this.Y;
                }
            }
            if (!this.j && this.h) {
                this.af = this.ae;
                this.ag = this.ae;
                this.ah = this.ae;
                this.ai = this.ae;
                this.ad = 0;
                while (this.ad < this.ae) {
                    if (!this.c(n2, n3 - this.ad)) {
                        this.af = this.ad;
                        break;
                    }
                    ++this.ad;
                }
                this.ad = 0;
                while (this.ad < this.ae) {
                    if (!this.c(n2, n3 + this.ad)) {
                        this.ag = this.ad;
                        break;
                    }
                    ++this.ad;
                }
                this.ac = 0;
                while (this.ac < this.ae) {
                    if (!this.c(n2 - this.ac, n3)) {
                        this.ah = this.ac;
                        break;
                    }
                    ++this.ac;
                }
                this.ac = 0;
                while (this.ac < this.ae) {
                    if (!this.c(n2 + this.ac, n3)) {
                        this.ai = this.ac;
                        break;
                    }
                    ++this.ac;
                }
                if (this.af == this.ae && this.ag == this.ae && this.ah == this.ae && this.ai == this.ae) {
                    this.ad = 0;
                    while (this.ad < 511) {
                        if (!this.c(n2, n3 - this.ad)) {
                            this.ak = n2;
                            this.al = n3 - this.ad;
                            return true;
                        }
                        ++this.ad;
                    }
                } else {
                    if (this.af <= this.ag && this.af <= this.ah && this.af <= this.ai) {
                        this.ak = n2;
                        this.al = n3 - this.af;
                        return true;
                    }
                    if (this.ag <= this.af && this.ag <= this.ah && this.ag <= this.ai) {
                        this.ak = n2;
                        this.al = n3 + this.ag;
                        return true;
                    }
                    if (this.ah <= this.ag && this.ah <= this.af && this.ah <= this.ai) {
                        this.ak = n2 - this.ah;
                        this.al = n3;
                        return true;
                    }
                    if (this.ai <= this.ag && this.ai <= this.ah && this.ai <= this.af) {
                        this.ak = n2 + this.ai;
                        this.al = n3;
                        return true;
                    }
                }
            }
            return false;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            this.ak = n2;
            this.al = n3;
            return true;
        }
    }

    public final void d() {
        com.mnemonicstudios.novusapp.n.a.l(this.c, this.d, 0xFF0000);
        this.i = false;
        switch (this.b) {
            case 6: {
                if (this.f) break;
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.v, this.c, this.d, this.H, this.I);
                com.mnemonicstudios.novusapp.n.a.a(this.f / 20 + 1, this.c, this.d - 15, com.mnemonicstudios.novusapp.n.H);
                return;
            }
            case 18: {
                com.mnemonicstudios.novusapp.n.a.b(this.D + 1, this.E, this.c + 1, this.d, 0x804000);
                com.mnemonicstudios.novusapp.n.a.b(this.D - 1, this.E, this.c - 1, this.d, 0x804000);
                com.mnemonicstudios.novusapp.n.a.b(this.D, this.E + 1, this.c, this.d + 1, 0x804000);
                com.mnemonicstudios.novusapp.n.a.b(this.D, this.E - 1, this.c, this.d - 1, 0x804000);
                com.mnemonicstudios.novusapp.n.a.b(this.D - 1, this.E + 1, this.c - 1, this.d + 1, 0x804000);
                com.mnemonicstudios.novusapp.n.a.b(this.D + 1, this.E - 1, this.c + 1, this.d - 1, 0x804000);
                return;
            }
            case 2: {
                if (this.c(this.c, this.d)) {
                    this.i = true;
                }
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.l, this.c, this.d, this.H, this.I);
                return;
            }
            case 8: {
                if (this.a) {
                    this.N = 0;
                    while (this.N < this.a.length) {
                        if (this.a[this.N][4] > 0) {
                            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.s, this.a[this.N][0] >> 16, this.a[this.N][7] >> 16, this.a[this.N][5], this.I);
                        }
                        ++this.N;
                    }
                    break;
                }
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.r, this.c, this.d, this.H, this.I);
                com.mnemonicstudios.novusapp.n.a.a(this.f / 20 + 1, this.c, this.d - 10, com.mnemonicstudios.novusapp.n.H);
                return;
            }
            case 1: {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.n, this.c, this.d, this.H, this.I);
                com.mnemonicstudios.novusapp.n.a.a(this.f / 10 + 1, this.c, this.d - 10, com.mnemonicstudios.novusapp.n.H);
                return;
            }
            case 21: {
                com.mnemonicstudios.novusapp.n.a.a(this.f / 10, this.c, this.d - 10, com.mnemonicstudios.novusapp.n.H);
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.t, this.c, this.d, this.H, this.I);
                return;
            }
            case 7: {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.u, this.c, this.d, this.H, this.I);
                return;
            }
            case 19: {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.o, this.c, this.d, this.H, this.I);
                return;
            }
            case 11: {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.w, this.c, this.d, 0, this.I);
                return;
            }
            case 5: {
                this.A = 0;
                while (this.A < this.d.length) {
                    if (this.d[this.A][4] >= 0) {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.O, this.d[this.A][0], this.d[this.A][1], this.d[this.A][4], 0);
                    }
                    ++this.A;
                }
                break;
            }
            case 20: 
            case 22: {
                if (this.f) break;
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.p, this.c, this.d, this.H, this.I);
            }
        }
    }

    public final int a() {
        return this.c;
    }

    public final int b() {
        return this.d;
    }

    public final boolean a(int n2, int n3, int n4, int n5, int n6) {
        this.j = true;
        this.k = false;
        this.l = false;
        this.ao = 0;
        this.ap = 0;
        this.a(n6, n2, n3, n4, n5);
        this.aq = 0;
        while (!this.k && !this.l) {
            this.c();
            ++this.aq;
            if (this.aq <= 500) continue;
            return false;
        }
        this.j = false;
        return this.l;
    }

    public final boolean c(int n2, int n3) {
        if (n2 > 1023 || n2 < 0) {
            return false;
        }
        if (n3 > 511 || n3 < 0) {
            return false;
        }
        return com.mnemonicstudios.novusapp.j.b(n2, n3) == 0;
    }

    public final boolean b() {
        return ar != 0;
    }

    public final void a(int n2) {
        if (ar == 0) {
            ar = 1;
            o = 2;
            this.as = 2;
            this.aA = 32;
            this.aw = 240 - this.aB * 4 >> 1;
            this.ax = 320 + this.aB * 4;
            this.aC = 0;
            this.aD = 0;
            m = false;
            return;
        }
        if (ar == 2) {
            ar = 3;
            this.aA = 16;
        }
    }

    public final void e() {
        switch (ar) {
            case 0: {
                return;
            }
            case 1: {
                this.ax -= this.aA;
                --this.aA;
                if (this.aA < 4) {
                    this.aA = 4;
                }
                if (this.ax < 320 - this.aB * 5) {
                    ar = 2;
                }
                com.mnemonicstudios.novusapp.n.a.h = false;
                m = false;
            }
            case 2: {
                if (com.mnemonicstudios.novusapp.n.k) {
                    n = true;
                }
                if (com.mnemonicstudios.novusapp.n.l) {
                    o = true;
                }
                if (com.mnemonicstudios.novusapp.n.i) {
                    p = true;
                }
                if (com.mnemonicstudios.novusapp.n.j) {
                    q = true;
                }
                if (com.mnemonicstudios.novusapp.n.m) {
                    r = true;
                }
                if (!com.mnemonicstudios.novusapp.n.k && n) {
                    s = true;
                }
                if (!com.mnemonicstudios.novusapp.n.l && o) {
                    t = true;
                }
                if (!com.mnemonicstudios.novusapp.n.i && p) {
                    u = true;
                }
                if (!com.mnemonicstudios.novusapp.n.j && q) {
                    v = true;
                }
                if (!com.mnemonicstudios.novusapp.n.m && r) {
                    w = true;
                }
                if (s) {
                    n = false;
                    s = false;
                    --this.aD;
                    if (this.aD < 0) {
                        this.aD = 3;
                    }
                }
                if (t) {
                    t = false;
                    o = false;
                    ++this.aD;
                    if (this.aD > 3) {
                        this.aD = 0;
                    }
                }
                if (u) {
                    u = false;
                    p = false;
                    --this.aC;
                    if (this.aC < 0) {
                        this.aC = 3;
                    }
                }
                if (v) {
                    v = false;
                    q = false;
                    ++this.aC;
                    if (this.aC > 3) {
                        this.aC = 0;
                    }
                }
                if (!w) break;
                w = false;
                r = false;
                if (e[this.aC][this.aD] <= 0 || a[com.mnemonicstudios.novusapp.n.a.al][e[this.aC][this.aD]][0] == 0) break;
                m = true;
                this.as = e[this.aC][this.aD];
                ar = 3;
                this.aA = 8;
                return;
            }
            case 3: {
                this.ax += this.aA;
                ++this.aA;
                if (this.ax <= 320 + this.aB * 2) break;
                ar = 0;
                if (this.as == 17) {
                    this.d(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g());
                }
                if (this.as == 9) {
                    com.mnemonicstudios.novusapp.n.a.W = 0;
                    b = true;
                    o = 9;
                }
                if (this.as == 5) {
                    com.mnemonicstudios.novusapp.n.a.W = 0;
                    b = true;
                    o = 5;
                }
                if (this.as == 11) {
                    com.mnemonicstudios.novusapp.n.a.W = 0;
                    b = true;
                    o = 11;
                }
                if (this.as != 13) break;
                com.mnemonicstudios.novusapp.n.a.W = 0;
                b = true;
                o = 13;
            }
        }
    }

    public final boolean c() {
        return m;
    }

    public final int c() {
        m = false;
        return this.as;
    }

    public final void c(Graphics graphics) {
        switch (ar) {
            case 0: {
                return;
            }
            case 1: 
            case 2: 
            case 3: {
                this.a(graphics, this.aw, this.ax);
            }
        }
    }

    public final void b(int n2, int n3, int n4, int n5, int n6) {
        switch (com.mnemonicstudios.novusapp.j.c) {
            case 0: {
                this.a(com.mnemonicstudios.novusapp.i.a, com.mnemonicstudios.novusapp.n.a.a(n2), com.mnemonicstudios.novusapp.n.a.b(n3), n4, n5, n6);
                return;
            }
            case 1: 
            case 2: {
                this.a(com.mnemonicstudios.novusapp.i.a, com.mnemonicstudios.novusapp.n.a.b(n3), com.mnemonicstudios.novusapp.n.a.a(n2), n4, n5, n6);
            }
        }
    }

    public final void a(Graphics graphics, int n2, int n3, int n4, int n5, int n6) {
        try {
            if (n6 == 1 && a[com.mnemonicstudios.novusapp.n.a.al][n4][0] == 0) {
                n6 = 0;
            }
        }
        catch (Exception exception) {}
        switch (n6) {
            case 0: {
                graphics.setColor(this.at, this.at, this.at);
                break;
            }
            case 1: {
                graphics.setColor(0, this.at, this.at);
                break;
            }
            case 2: {
                graphics.setColor(192, 0, 0);
            }
        }
        graphics.fillRect(n2, n3, this.aB, this.aB);
        switch (n6) {
            case 0: {
                graphics.setColor(192, 192, 192);
                break;
            }
            case 1: {
                graphics.setColor(0, 192, 192);
                break;
            }
            case 2: {
                graphics.setColor(255, 0, 0);
            }
        }
        graphics.drawLine(n2, n3, n2 + this.aB - 2, n3);
        graphics.drawLine(n2, n3, n2, n3 + this.aB - 2);
        graphics.drawLine(n2 + this.aB - 2, n3 + 2, n2 + this.aB - 2, n3 + this.aB - 3);
        graphics.drawLine(n2 + this.aB - 2, n3 + this.aB - 2, n2 + 2, n3 + this.aB - 2);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.x, n2 + (this.aB >> 1), n3 + this.aB - 5, n4, 0);
    }

    public final void a(Graphics graphics, int n2, int n3) {
        this.av = 0;
        while (this.av < 4) {
            this.au = 0;
            while (this.au < 4) {
                this.ay = this.au * (this.aB + 2) + n2 - 2;
                this.az = this.av * (this.aB + 2) + n3;
                try {
                    this.aE = e[this.au][this.av] == 0 ? 0 : 1;
                    if (this.aC == this.au && this.aD == this.av) {
                        this.aE = 2;
                        if (e[this.au][this.av] > 0 && a[com.mnemonicstudios.novusapp.n.a.al][e[this.au][this.av]][0] != 0) {
                            switch (com.mnemonicstudios.novusapp.j.c) {
                                case 0: {
                                    if (a[com.mnemonicstudios.novusapp.n.a.al][e[this.au][this.av]][0] > 0) {
                                        com.mnemonicstudios.novusapp.p.a(n2 + 8, n3 - 40, 128, 38);
                                        com.mnemonicstudios.novusapp.p.a(a[e[this.au][this.av] - 1], 0);
                                        com.mnemonicstudios.novusapp.p.b(graphics);
                                        com.mnemonicstudios.novusapp.n.a.b(a[com.mnemonicstudios.novusapp.n.a.al][e[this.au][this.av]][0], n2, n3 - 14, com.mnemonicstudios.novusapp.n.H);
                                        break;
                                    }
                                    com.mnemonicstudios.novusapp.p.a(n2, n3 - 40, 128, 38);
                                    com.mnemonicstudios.novusapp.p.a(a[e[this.au][this.av] - 1], 0);
                                    com.mnemonicstudios.novusapp.p.b(graphics);
                                    break;
                                }
                                case 1: 
                                case 2: {
                                    if (a[com.mnemonicstudios.novusapp.n.a.al][e[this.au][this.av]][0] > 0) {
                                        com.mnemonicstudios.novusapp.n.a.b(graphics, a[e[this.au][this.av] - 1], n3 - 26, n2 - 16, 20, com.mnemonicstudios.novusapp.n.F);
                                        com.mnemonicstudios.novusapp.n.a.b(a[com.mnemonicstudios.novusapp.n.a.al][e[this.au][this.av]][0], n3 - 34, n2 + 10, com.mnemonicstudios.novusapp.n.F);
                                        break;
                                    }
                                    com.mnemonicstudios.novusapp.n.a.b(graphics, a[e[this.au][this.av] - 1], n3 - 34, n2 - 16, 20, com.mnemonicstudios.novusapp.n.F);
                                }
                            }
                        }
                    }
                    if (a[com.mnemonicstudios.novusapp.n.a.al][e[this.au][this.av]][0] == 0) {
                        this.a(graphics, this.ay, this.az, 0, this.au, this.aE);
                    } else {
                        this.a(graphics, this.ay, this.az, e[this.au][this.av], this.au, this.aE);
                    }
                }
                catch (Exception exception) {
                    Exception exception2 = exception;
                    exception.printStackTrace();
                }
                ++this.au;
            }
            ++this.av;
        }
    }

    public final void a(int n2, int n3, int n4) {
        com.mnemonicstudios.novusapp.g.a[n2][n3][0] = n4;
        com.mnemonicstudios.novusapp.g.a[n2][17][0] = -1;
        com.mnemonicstudios.novusapp.g.a[n2][2][0] = -1;
        com.mnemonicstudios.novusapp.g.a[n2][15][0] = -1;
        com.mnemonicstudios.novusapp.g.a[n2][16][0] = -1;
    }

    public final void b(int n2, int n3, int n4) {
        int[] nArray = a[n2][n3];
        nArray[0] = nArray[0] + n4;
        com.mnemonicstudios.novusapp.g.a[n2][17][0] = -1;
        com.mnemonicstudios.novusapp.g.a[n2][2][0] = -1;
        com.mnemonicstudios.novusapp.g.a[n2][15][0] = -1;
        com.mnemonicstudios.novusapp.g.a[n2][16][0] = -1;
    }

    static {
        a = new int[]{77, 75, 78, 95, 88, 91, 81, 92, 84, 96, 87, 83, 93, 94, 118, 98, 85};
        b = new int[]{2, 8, 1, 11, 22, 2, 7};
        c = new int[16][8];
        q = 0;
        r = 1;
        s = 2;
        t = 3;
        u = 4;
        v = 5;
        w = 6;
        ar = 0;
        m = false;
        n = false;
        o = false;
        p = false;
        q = false;
        r = false;
        s = false;
        t = false;
        u = false;
        v = false;
        w = false;
        e = new int[][]{{2, 1, 14, 13}, {5, 3, 7, 4}, {6, 12, 8, 16}, {15, 9, 11, 17}};
        a = new int[4][25][1];
    }
}


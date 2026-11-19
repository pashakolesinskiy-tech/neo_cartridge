/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 *  javax.microedition.lcdui.game.Sprite
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.g;
import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.n;
import com.mnemonicstudios.novusapp.r;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class j {
    static int a = 240;
    static int b = 320;
    static int c = 0;
    int d;
    boolean a;
    boolean b;
    int e;
    int f;
    int g;
    int h = 10;
    int i;
    int j;
    int k;
    int l;
    int m = 0x606060;
    int n;
    int o;
    int p;
    int q;
    int r;
    int s;
    int t;
    int u;
    int v;
    int w;
    int x;
    int y;
    int z;
    int A;
    int B;
    int C;
    int D;
    int E;
    int F;
    int G;
    int[][] a;
    int[][] b;
    int H;
    int I;
    int J;
    int K;
    int L;
    int M;
    int N;
    int O;
    int P;
    int Q;
    int R;
    int S;
    int T;
    int U;
    int V;
    Sprite[] a;
    Image[] a;
    Image a;
    boolean c;
    int W;
    int X;
    boolean d;
    public static int[][][] a = new int[5][32][16];
    public static int[][][] b = new int[32][16][33];
    public static int[] a = new int[1023];
    static int Y;
    static int Z;
    static int aa;
    static int ab;
    static int ac;
    static int ad;
    static int ae;
    static int af;
    int ag;
    int ah;
    int ai;
    int aj;
    int ak;
    boolean e;
    int al;
    int am;
    static boolean f;
    int an;
    int ao;
    int ap;
    int aq;
    int ar;
    int as;
    int at;
    int au;
    int av;
    int aw;
    int ax;
    static int ay;
    static int az;
    static int aA;
    static int aB;
    static int aC;
    static int aD;
    static int aE;
    static int aF;
    static int aG;
    static int aH;
    static boolean g;
    static boolean h;
    static int aI;
    static int aJ;
    static int aK;
    static int aL;
    static int aM;
    static int aN;
    static int aO;
    int[] b;
    int[] c;
    int[] d;
    int[] e;
    int aP;
    static int aQ;
    static int aR;
    static int aS;
    static int aT;
    static int aU;
    static int aV;
    static int aW;
    static int aX;
    public static int[] f;
    public static int[][] c;
    public static int[] g;
    public static int[] h;
    public static int[][] d;
    public static int aY;
    int aZ;
    int ba;
    int bb;
    int bc;
    int bd;
    int be;
    int bf;
    int bg;
    int bh;
    int bi;
    int bj;
    int bk;
    int bl;
    int bm;
    int bn;
    int bo;
    static int bp;
    static int bq;
    static int br;
    static int bs;
    static int bt;
    static int bu;
    int bv;
    int bw;
    static int bx;
    static int by;
    int bz;
    int bA;
    int bB;
    int bC;
    boolean i;
    boolean j;
    int bD;
    int bE;
    Image b;
    Image c;
    Image d;
    Image e;
    Image f = -60;
    Image g = 26;
    Sprite a = false;
    Sprite b;
    public static int bF;
    public static int bG;
    public static int bH;
    public static int bI;
    public static int bJ;
    boolean k;
    boolean l = 16;
    public static boolean m;
    public static int bK;
    public static int bL;
    public static int bM;
    boolean n = 0xD0D0D0;
    boolean o = 160;
    int bN;
    int bO;
    int bP;
    int bQ;
    int bR;
    int bS;
    int bT;
    int bU;
    boolean p = 41120;
    int bV;
    int bW;
    int bX;
    int bY;
    int bZ;
    public static boolean q;
    public static long a;
    boolean r = 0;
    boolean s = 0x800000;
    boolean t;
    boolean u = 0xF0F000;
    boolean v;
    boolean w;
    boolean x;
    int ca;
    int cb;
    int cc;
    int cd;
    int ce;
    public static int cf;
    public static int cg;
    int ch;
    int ci;
    boolean y;
    int cj;
    int ck;
    long b = false;
    int cl;
    public static int[] i;
    public static int[] j;
    static int cm;
    static int cn;
    static int co;
    static int cp;
    static int cq;
    static long c;
    static long d;
    static long e;
    static int cr;
    static long f;
    static long g;
    int[][] e;
    static final int[] k;
    int cs;

    public final void a(int n2) {
        c = n2;
        if (c == 1) {
            c = 2;
        }
        switch (c) {
            case 0: {
                a = 240;
                b = 320;
                break;
            }
            case 1: 
            case 2: {
                a = 320;
                b = 240;
            }
        }
        this.f();
        this.g();
        com.mnemonicstudios.novusapp.n.a.a();
    }

    public final void b(int n2) {
        this.f = n2;
        if (this.f > 100) {
            this.f = 100;
        }
        if (this.f < -100) {
            this.f = -100;
        }
    }

    public final int a() {
        return this.f;
    }

    public final int b() {
        return this.e;
    }

    public final void a() {
        this.a = true;
        this.e = 0;
    }

    public final void b() {
        this.a = false;
        this.b = false;
        this.e = 0;
    }

    public final void c() {
        this.b = true;
    }

    public final void a(Graphics graphics, int n2, int n3, int n4, int n5, int n6) {
        if (n2 < 1) {
            return;
        }
        this.d = (n3 >> 2) * n2;
        graphics.setColor((n6 & 0xFEFEFE) >> 1);
        graphics.drawLine(n4, n5 + 1, n4 + this.d, n5 + 1);
        graphics.setColor(n6);
        graphics.drawLine(n4, n5, n4 + this.d, n5);
    }

    public final void b(Graphics graphics, int n2, int n3, int n4, int n5, int n6) {
        if (n2 < 1) {
            return;
        }
        this.d = (n3 >> 2) * n2;
        graphics.setColor((n6 & 0xFEFEFE) >> 1);
        graphics.drawLine(n5 + 1, n4, n5 + 1, n4 + this.d);
        graphics.setColor(n6);
        graphics.drawLine(n5, n4, n5, n4 + this.d);
    }

    public final void a(Graphics graphics) {
        if (this.W == 4) {
            return;
        }
        this.i = (a >> 1) + (a >> 2) - (a >> 3);
        com.mnemonicstudios.novusapp.n.a.a(graphics, this.j - (this.i >> 1) - 30, this.k - (this.l >> 1) - 10, com.mnemonicstudios.novusapp.n.a.h(), 0, 1);
        com.mnemonicstudios.novusapp.n.a.a(graphics, this.j + (this.i >> 1) + 4, this.k - (this.l >> 1) - 10, 0, 0, 1);
        graphics.setColor(0);
        graphics.fillRect(this.j + (this.i >> 1) + 6, this.k - (this.l >> 1) - 8, 24, 24);
        graphics.setColor(255, 0, 0);
        graphics.fillRect(this.j + (this.i >> 1) + 11, this.k - (this.l >> 1) - 4, 5, 16);
        graphics.fillRect(this.j + (this.i >> 1) + 20, this.k - (this.l >> 1) - 4, 5, 16);
        graphics.setColor(0);
        graphics.fillRect(this.j - (this.i >> 1), this.k - (this.l >> 1) - 4, this.i, 4);
        switch (com.mnemonicstudios.novusapp.n.a.d()) {
            case 2: {
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 1, this.j - (this.i >> 1) + 1, this.k - (this.l >> 1) - 3, 0xFF0000);
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 1, this.j + 1, this.k - (this.l >> 1) - 3, 65280);
                break;
            }
            case 3: {
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 2, this.j + 1 - (this.i >> 1), this.k - (this.l >> 1) - 3, 0xFF0000);
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 2, this.j + 1 - (this.i >> 2), this.k - (this.l >> 1) - 3, 65280);
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(2), this.i >> 2, this.j + 1, this.k - (this.l >> 1) - 3, 0xFFFF00);
                break;
            }
            case 4: {
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 2, this.j + 1 - (this.i >> 1), this.k - (this.l >> 1) - 3, 0xFF0000);
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 2, this.j + 1 - (this.i >> 2), this.k - (this.l >> 1) - 3, 65280);
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(2), this.i >> 2, this.j + 1, this.k - (this.l >> 1) - 3, 0xFFFF00);
                this.a(graphics, com.mnemonicstudios.novusapp.n.a.b(3), this.i >> 2, this.j + 1 + (this.i >> 2), this.k - (this.l >> 1) - 3, 65535);
            }
        }
        this.t = (this.i << 15) / 100;
        this.j = a >> 1;
        this.k = b - (this.l + 2);
        if (com.mnemonicstudios.novusapp.n.a.e() > 0) {
            if (q) {
                if (a - System.currentTimeMillis() > 0L) {
                    com.mnemonicstudios.novusapp.n.a.d((int)((a - System.currentTimeMillis()) / 1000L), a - this.g, this.h, com.mnemonicstudios.novusapp.n.Q, 18);
                }
            } else {
                com.mnemonicstudios.novusapp.n.a.d(com.mnemonicstudios.novusapp.n.a.e(), a - this.g, this.h, com.mnemonicstudios.novusapp.n.Q, 18);
            }
        }
        ++this.r;
        if (this.r >= this.l >> 1) {
            this.r = 0;
        }
        if (this.f < 0) {
            graphics.setClip(this.j + (this.f * this.t >> 16), this.k - (this.l >> 1), -(this.f * this.t >> 16), this.l);
            this.q = -(this.l >> 1);
            while (this.q <= (this.i >> 1) - (this.l >> 1)) {
                graphics.setColor(this.s);
                graphics.fillTriangle(this.j - this.q - this.r, this.k - (this.l >> 1), this.j - this.q - this.r, this.k + (this.l >> 1), this.j - this.q - this.r - (this.l >> 1), this.k);
                this.q += this.l >> 1;
            }
        } else {
            graphics.setClip(this.j, this.k - (this.l >> 1), this.f * this.t >> 16, this.l);
            this.q = -(this.l >> 1);
            while (this.q <= (this.i >> 1) - (this.l >> 1)) {
                graphics.setColor(this.s);
                graphics.fillTriangle(this.j + this.q + this.r, this.k - (this.l >> 1), this.j + this.q + this.r, this.k + (this.l >> 1), this.j + this.q + this.r + (this.l >> 1), this.k);
                this.q += this.l >> 1;
            }
        }
        graphics.setClip(0, 0, a, b);
        if (this.a) {
            if (!this.b) {
                this.e += 6;
            }
            if (this.e > 200) {
                this.e = 200;
            }
            graphics.setColor(this.u);
            graphics.fillRect(this.j - (this.i >> 1), this.k - (this.l >> 1), this.e * this.t >> 16, this.l);
        }
        graphics.setColor(this.o);
        graphics.fillRect(this.j - 1, this.k - (this.l >> 1), 2, this.l);
        graphics.setColor(this.p);
        graphics.fillRect(this.j - 1, this.k - (this.l >> 2), 2, this.l >> 2);
        graphics.setColor(this.m);
        graphics.drawRect(this.j - (this.i >> 1) + 1, this.k - (this.l >> 1) + 1, this.i, this.l);
        graphics.setColor(this.n);
        graphics.drawRect(this.j - (this.i >> 1), this.k - (this.l >> 1), this.i, this.l);
    }

    private void h(Graphics graphics) {
        if (this.W == 4) {
            return;
        }
        this.i = (a >> 1) + (a >> 2) - (a >> 3);
        com.mnemonicstudios.novusapp.n.a.a(graphics, this.k - (this.l >> 1) - 2, this.j - (this.i >> 1) - 24, com.mnemonicstudios.novusapp.n.a.h(), 0, 1);
        graphics.setColor(0);
        graphics.fillRect(this.k - (this.l >> 1) - 4, this.j - (this.i >> 1), 4, this.i);
        switch (com.mnemonicstudios.novusapp.n.a.d()) {
            case 2: {
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 1, this.j - (this.i >> 1) + 1, this.k - (this.l >> 1) - 3, 0xFF0000);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 1, this.j + 1, this.k - (this.l >> 1) - 3, 65280);
                break;
            }
            case 3: {
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 2, this.j + 1 - (this.i >> 1), this.k - (this.l >> 1) - 3, 0xFF0000);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 2, this.j + 1 - (this.i >> 2), this.k - (this.l >> 1) - 3, 65280);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(2), this.i >> 2, this.j + 1, this.k - (this.l >> 1) - 3, 0xFFFF00);
                break;
            }
            case 4: {
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 2, this.j + 1 - (this.i >> 1), this.k - (this.l >> 1) - 3, 0xFF0000);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 2, this.j + 1 - (this.i >> 2), this.k - (this.l >> 1) - 3, 65280);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(2), this.i >> 2, this.j + 1, this.k - (this.l >> 1) - 3, 0xFFFF00);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(3), this.i >> 2, this.j + 1 + (this.i >> 2), this.k - (this.l >> 1) - 3, 65535);
            }
        }
        this.t = (this.i << 15) / 100;
        this.j = a >> 1;
        this.k = b - 20;
        if (com.mnemonicstudios.novusapp.n.a.e() > 0) {
            com.mnemonicstudios.novusapp.n.a.a("" + com.mnemonicstudios.novusapp.n.a.e(), 22, this.g + 4, 65535);
        }
        ++this.r;
        if (this.r >= this.l >> 1) {
            this.r = 0;
        }
        if (this.f < 0) {
            graphics.setClip(this.k - (this.l >> 1), this.j + (this.f * this.t >> 16), this.l, -(this.f * this.t >> 16));
            this.q = -(this.l >> 1);
            while (this.q <= (this.i >> 1) - (this.l >> 1)) {
                graphics.setColor(this.s);
                graphics.fillTriangle(this.k - (this.l >> 1), this.j - this.q - this.r, this.k + (this.l >> 1), this.j - this.q - this.r, this.k, this.j - this.q - this.r - (this.l >> 1));
                this.q += this.l >> 1;
            }
        } else {
            graphics.setClip(this.k - (this.l >> 1), this.j, this.l, this.f * this.t >> 16);
            this.q = -(this.l >> 1);
            while (this.q <= (this.i >> 1) - (this.l >> 1)) {
                graphics.setColor(this.s);
                graphics.fillTriangle(this.k - (this.l >> 1), this.j + this.q + this.r, this.k + (this.l >> 1), this.j + this.q + this.r, this.k, this.j + this.q + this.r + (this.l >> 1));
                this.q += this.l >> 1;
            }
        }
        graphics.setClip(0, 0, 240, 320);
        if (this.a) {
            if (!this.b) {
                this.e += 3;
            }
            if (this.e > 200) {
                this.e = 200;
            }
            graphics.setColor(this.u);
            graphics.fillRect(this.k - (this.l >> 1), this.j + (this.i >> 1) - (this.e * this.t >> 16), this.l, this.e * this.t >> 16);
        }
        graphics.setColor(this.o);
        graphics.fillRect(this.k - (this.l >> 1), this.j - 1, this.l, 2);
        graphics.setColor(this.p);
        graphics.fillRect(this.k - (this.l >> 2), this.j - 1, this.l >> 2, 2);
        graphics.setColor(this.m);
        graphics.drawRect(this.k - (this.l >> 1) + 1, this.j - (this.i >> 1) + 1, this.l, this.i);
        graphics.setColor(this.n);
        graphics.drawRect(this.k - (this.l >> 1), this.j - (this.i >> 1), this.l, this.i);
    }

    private void i(Graphics graphics) {
        if (this.W == 4) {
            return;
        }
        this.i = (a >> 1) + (a >> 2) - (a >> 3);
        com.mnemonicstudios.novusapp.n.a.a(graphics, 20, 284, com.mnemonicstudios.novusapp.n.a.h(), 0, 1);
        com.mnemonicstudios.novusapp.n.a.a(graphics, 204, 284, 0, 0, 1);
        graphics.setColor(0);
        graphics.fillRect(206, 286, 24, 24);
        graphics.setColor(255, 0, 0);
        graphics.fillRect(210, 290, 16, 5);
        graphics.fillRect(210, 301, 16, 5);
        graphics.setColor(0);
        graphics.fillRect(240 - (this.k - (this.l + 10)), this.j - (this.i >> 1), 4, this.i + 1);
        switch (com.mnemonicstudios.novusapp.n.a.d()) {
            case 2: {
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 1, this.j - (this.i >> 1), 240 - this.k + this.l + 11, 0xFF0000);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 1, this.j, 240 - this.k + this.l + 11, 65280);
                break;
            }
            case 3: {
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 2, this.j - (this.i >> 1), 240 - this.k + this.l + 11, 0xFF0000);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 2, this.j - (this.i >> 2), 240 - this.k + this.l + 11, 65280);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(2), this.i >> 2, this.j, 240 - this.k + this.l + 11, 0xFFFF00);
                break;
            }
            case 4: {
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(0), this.i >> 2, this.j - (this.i >> 1), 240 - this.k + this.l + 11, 0xFF0000);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(1), this.i >> 2, this.j - (this.i >> 2), 240 - this.k + this.l + 11, 65280);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(2), this.i >> 2, this.j, 240 - this.k + this.l + 11, 0xFFFF00);
                this.b(graphics, com.mnemonicstudios.novusapp.n.a.b(3), this.i >> 2, this.j + (this.i >> 2), 240 - this.k + this.l + 11, 65535);
            }
        }
        this.t = (this.i << 15) / 100;
        this.j = a >> 1;
        this.k = b - 20;
        if (com.mnemonicstudios.novusapp.n.a.e() > 0) {
            if (q) {
                if (a - System.currentTimeMillis() > 0L) {
                    com.mnemonicstudios.novusapp.n.a.d((int)((a - System.currentTimeMillis()) / 1000L), this.g, this.h, com.mnemonicstudios.novusapp.n.Q, 18);
                }
            } else {
                com.mnemonicstudios.novusapp.n.a.d(com.mnemonicstudios.novusapp.n.a.e(), this.g, this.h, com.mnemonicstudios.novusapp.n.Q, 18);
            }
        }
        ++this.r;
        if (this.r >= this.l >> 1) {
            this.r = 0;
        }
        if (this.f < 0) {
            graphics.setClip(240 - (this.k - (this.l >> 1)), this.j + (this.f * this.t >> 16), this.l, -(this.f * this.t >> 16));
            this.q = -(this.l >> 1);
            while (this.q <= (this.i >> 1) - (this.l >> 1)) {
                graphics.setColor(this.s);
                graphics.fillTriangle(240 - (this.k - (this.l >> 1)) + this.l, this.j - this.q - this.r, 240 - (this.k + (this.l >> 1)) + this.l, this.j - this.q - this.r, 240 - this.k + this.l, this.j - this.q - this.r - (this.l >> 1));
                this.q += this.l >> 1;
            }
        } else {
            graphics.setClip(240 - (this.k - (this.l >> 1)), this.j, this.l, this.f * this.t >> 16);
            this.q = -(this.l >> 1);
            while (this.q <= (this.i >> 1) - (this.l >> 1)) {
                graphics.setColor(this.s);
                graphics.fillTriangle(240 - (this.k - (this.l >> 1)) + this.l, this.j + this.q + this.r, 240 - (this.k + (this.l >> 1)) + this.l, this.j + this.q + this.r, 240 - this.k + this.l, this.j + this.q + this.r + (this.l >> 1));
                this.q += this.l >> 1;
            }
        }
        graphics.setClip(0, 0, 240, 320);
        if (this.a) {
            if (!this.b) {
                this.e += 3;
            }
            if (this.e > 200) {
                this.e = 200;
            }
            graphics.setColor(this.u);
            graphics.fillRect(240 - (this.k - (this.l >> 1)), this.j - (this.i >> 1), this.l, this.e * this.t >> 16);
        }
        graphics.setColor(this.o);
        graphics.fillRect(240 - (this.k - (this.l >> 1)), this.j - 1, this.l, 2);
        graphics.setColor(this.p);
        graphics.fillRect(240 - (this.k - this.l), this.j - 1, this.l >> 2, 2);
        graphics.setColor(this.m);
        graphics.drawRect(240 - (this.k - (this.l >> 1) + 1), this.j - (this.i >> 1) + 1, this.l, this.i);
        graphics.setColor(this.n);
        graphics.drawRect(240 - (this.k - (this.l >> 1)), this.j - (this.i >> 1), this.l, this.i);
    }

    public j() {
        int[][] nArrayArray = new int[][]{{-2, 0}, {0, -1}, {2, 0}, {0, 1}};
        this.a = new int[][]{{-3, -1}, {3, -1}, {3, 1}, {-3, 1}};
        this.b = new int[][]{{-1, -3}, {1, -3}, {1, 3}, {-1, 3}};
        this.a = new Sprite[16];
        this.a = new Image[16];
        this.c = false;
        this.X = 4;
        this.d = true;
        this.ah = 1;
        this.ai = 0;
        this.aj = 0;
        this.ak = 0;
        this.e = false;
        this.b = new int[10];
        this.c = new int[10];
        this.d = new int[10];
        this.e = new int[10];
        this.bm = 32;
        this.bv = 32;
        this.bw = 32;
        this.i = false;
        this.j = false;
        this.k = false;
        this.l = false;
        this.n = false;
        this.o = false;
        this.ca = 0;
        this.cb = 0;
        this.cc = 0;
        this.cd = 0;
        this.ce = 0;
        this.y = false;
        this.b = 0L;
        this.e = new int[16][8];
    }

    public final void a(int n2, String string) {
        try {
            if (this.a[n2] != null) {
                this.a[n2] = null;
                try {
                    Thread.sleep(250L);
                }
                catch (Exception exception) {}
                System.gc();
            }
            this.a[n2] = Image.createImage((String)("/" + string));
            this.a[n2] = new Sprite(this.a[n2], this.bv, this.bw);
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void a(int n2, int n3, int n4, int n5) {
        this.v = 0;
        this.w = 0;
        this.y = 512;
        com.mnemonicstudios.novusapp.j.a(n2, n3, n4);
        this.x = 0;
        while (this.x < 4096) {
            this.v = n4 * i[this.x] >> 16;
            this.w = n4 * j[this.x] >> 16;
            switch (n5) {
                case 0: 
                case 1: 
                case 2: {
                    com.mnemonicstudios.novusapp.j.a(n2 + this.v, n3 + this.w, (n4 >> 1) + com.mnemonicstudios.novusapp.n.a(n4 >> 1) - (n4 >> 2));
                    break;
                }
                case 3: {
                    this.b(n2 + this.v, n3 + this.w, com.mnemonicstudios.novusapp.n.a(4095), (n4 >> 2) + com.mnemonicstudios.novusapp.n.a(n4 >> 2) - (n4 >> 3));
                    break;
                }
                case 4: {
                    this.c(n2 + this.v, n3 + this.w, com.mnemonicstudios.novusapp.n.a(512), n4 >> 2);
                }
            }
            this.x += this.y;
        }
    }

    public final void b(int n2, int n3, int n4, int n5) {
        this.f(n2, n3, n4, n5);
        this.g(n2, n3, n4, n5);
    }

    public final void c(int n2, int n3, int n4, int n5) {
        this.d(n2, n3, n4, n5);
        this.e(n2, n3, n4, n5);
    }

    public final void d(int n2, int n3, int n4, int n5) {
        this.f(n2, n3, n4, n5);
        this.z = this.a[0][0] * n5;
        this.A = 0;
        this.B = this.a[1][0] * n5;
        this.C = 0;
        this.z = this.z * i[n4] - this.A * j[n4] >> 16;
        this.A = this.z * j[n4] + this.A * i[n4] >> 16;
        this.B = this.B * i[n4] - this.C * j[n4] >> 16;
        this.C = this.B * j[n4] + this.C * i[n4] >> 16;
        com.mnemonicstudios.novusapp.j.a(this.z + n2, this.A + n3, n5);
        com.mnemonicstudios.novusapp.j.a(this.B + n2, this.C + n3, n5);
    }

    public final void e(int n2, int n3, int n4, int n5) {
        this.g(n2, n3, n4, n5);
        this.z = 0;
        this.A = this.b[1][1] * n5;
        this.B = 0;
        this.C = this.b[2][1] * n5;
        this.z = this.z * i[n4] - this.A * j[n4] >> 16;
        this.A = this.z * j[n4] + this.A * i[n4] >> 16;
        this.B = this.B * i[n4] - this.C * j[n4] >> 16;
        this.C = this.B * j[n4] + this.C * i[n4] >> 16;
        com.mnemonicstudios.novusapp.j.a(this.z + n2, this.A + n3, n5);
        com.mnemonicstudios.novusapp.j.a(this.B + n2, this.C + n3, n5);
    }

    public final void f(int n2, int n3, int n4, int n5) {
        this.z = this.a[0][0] * n5;
        this.A = this.a[0][1] * n5;
        this.B = this.a[1][0] * n5;
        this.C = this.a[1][1] * n5;
        this.D = this.a[2][0] * n5;
        this.E = this.a[2][1] * n5;
        this.F = this.a[3][0] * n5;
        this.G = this.a[3][1] * n5;
        this.z = this.z * i[n4] - this.A * j[n4] >> 16;
        this.A = this.z * j[n4] + this.A * i[n4] >> 16;
        this.B = this.B * i[n4] - this.C * j[n4] >> 16;
        this.C = this.B * j[n4] + this.C * i[n4] >> 16;
        this.D = this.D * i[n4] - this.E * j[n4] >> 16;
        this.E = this.D * j[n4] + this.E * i[n4] >> 16;
        this.F = this.F * i[n4] - this.G * j[n4] >> 16;
        this.G = this.F * j[n4] + this.G * i[n4] >> 16;
        this.a(this.z + n2, this.A + n3, this.B + n2, this.C + n3, this.D + n2, this.E + n3);
        this.a(this.z + n2, this.A + n3, this.F + n2, this.G + n3, this.D + n2, this.E + n3);
    }

    public final void g(int n2, int n3, int n4, int n5) {
        this.z = this.b[0][0] * n5;
        this.A = this.b[0][1] * n5;
        this.B = this.b[1][0] * n5;
        this.C = this.b[1][1] * n5;
        this.D = this.b[2][0] * n5;
        this.E = this.b[2][1] * n5;
        this.F = this.b[3][0] * n5;
        this.G = this.b[3][1] * n5;
        this.z = this.z * i[n4] - this.A * j[n4] >> 16;
        this.A = this.z * j[n4] + this.A * i[n4] >> 16;
        this.B = this.B * i[n4] - this.C * j[n4] >> 16;
        this.C = this.B * j[n4] + this.C * i[n4] >> 16;
        this.D = this.D * i[n4] - this.E * j[n4] >> 16;
        this.E = this.D * j[n4] + this.E * i[n4] >> 16;
        this.F = this.F * i[n4] - this.G * j[n4] >> 16;
        this.G = this.F * j[n4] + this.G * i[n4] >> 16;
        this.a(this.z + n2, this.A + n3, this.B + n2, this.C + n3, this.D + n2, this.E + n3);
        this.a(this.z + n2, this.A + n3, this.F + n2, this.G + n3, this.D + n2, this.E + n3);
    }

    public static final void a(int n2, int n3, int n4) {
        if (n3 < -n4) {
            return;
        }
        if (n2 < -n4) {
            return;
        }
        if (n2 > 1023 + n4) {
            return;
        }
        if (n3 > 511 + n4) {
            return;
        }
        aQ = 1 - n4;
        aR = 0;
        aS = -2 * n4;
        aT = 0;
        aU = n4;
        com.mnemonicstudios.novusapp.j.f(n2 - n4, n2 + n4, n3);
        while (aT < aU) {
            if (aQ >= 0) {
                --aU;
                aQ += (aS += 2);
            }
            aQ += (aR += 2) + 1;
            com.mnemonicstudios.novusapp.j.f(n2 - ++aT, n2 + aT, n3 + aU);
            com.mnemonicstudios.novusapp.j.f(n2 - aT, n2 + aT, n3 - aU);
            com.mnemonicstudios.novusapp.j.f(n2 - aU, n2 + aU, n3 + aT);
            com.mnemonicstudios.novusapp.j.f(n2 - aU, n2 + aU, n3 - aT);
        }
    }

    public final void a(int n2, int n3, int n4, int n5, int n6, int n7) {
        this.O = n2;
        this.P = n3;
        this.Q = n4;
        this.R = n5;
        this.S = n6;
        this.T = n7;
        if (this.P > this.R) {
            this.U = this.Q;
            this.V = this.R;
            this.Q = this.O;
            this.R = this.P;
            this.O = this.U;
            this.P = this.V;
        }
        if (this.R > this.T) {
            this.U = this.S;
            this.V = this.T;
            this.S = this.Q;
            this.T = this.R;
            this.Q = this.U;
            this.R = this.V;
        }
        if (this.P > this.T) {
            this.U = this.S;
            this.V = this.T;
            this.S = this.O;
            this.T = this.P;
            this.O = this.U;
            this.P = this.V;
        }
        if (this.P > this.R) {
            this.U = this.Q;
            this.V = this.R;
            this.Q = this.O;
            this.R = this.P;
            this.O = this.U;
            this.P = this.V;
        }
        if (this.R > this.T) {
            this.U = this.S;
            this.V = this.T;
            this.S = this.Q;
            this.T = this.R;
            this.Q = this.U;
            this.R = this.V;
        }
        if (this.P > this.T) {
            this.U = this.S;
            this.V = this.T;
            this.S = this.O;
            this.T = this.P;
            this.O = this.U;
            this.P = this.V;
        }
        try {
            this.H = (this.Q - this.O << 16) / (this.R - this.P);
        }
        catch (Exception exception) {
            this.H = 0;
        }
        try {
            this.I = (this.S - this.O << 16) / (this.T - this.P);
        }
        catch (Exception exception) {
            this.I = 0;
        }
        try {
            this.J = (this.S - this.Q << 16) / (this.T - this.R);
        }
        catch (Exception exception) {
            this.J = 0;
        }
        this.L = this.H;
        this.M = this.I;
        this.N = this.J;
        this.K = this.P;
        while (this.K < this.R) {
            com.mnemonicstudios.novusapp.j.f(this.O + (this.L >> 16), this.O + (this.M >> 16), this.K);
            this.L += this.H;
            this.M += this.I;
            ++this.K;
        }
        this.K = this.R;
        while (this.K < this.T) {
            com.mnemonicstudios.novusapp.j.f(this.Q + (this.N >> 16), this.O + (this.M >> 16), this.K);
            this.N += this.J;
            this.M += this.I;
            ++this.K;
        }
    }

    public final void d() {
        this.ai = 0;
        this.aj = 0;
        this.ak = 0;
        this.e = true;
    }

    public final void e() {
        this.ai = 0;
        this.aj = 0;
        this.ak = 0;
        this.e = false;
    }

    public final boolean a() {
        try {
            this.f();
            switch (this.ai) {
                case 0: {
                    this.ag = 0;
                    while (this.ag < 1023) {
                        com.mnemonicstudios.novusapp.j.a[this.ag] = 0;
                        com.mnemonicstudios.novusapp.j.f[this.ag] = 0;
                        ++this.ag;
                    }
                    break;
                }
                case 1: {
                    try {
                        for (Z = 0; Z < 16; ++Z) {
                            for (Y = 0; Y < 32; ++Y) {
                                com.mnemonicstudios.novusapp.j.a[0][com.mnemonicstudios.novusapp.j.Y][com.mnemonicstudios.novusapp.j.Z] = 0;
                                com.mnemonicstudios.novusapp.j.a[1][com.mnemonicstudios.novusapp.j.Y][com.mnemonicstudios.novusapp.j.Z] = 0;
                                com.mnemonicstudios.novusapp.j.a[2][com.mnemonicstudios.novusapp.j.Y][com.mnemonicstudios.novusapp.j.Z] = 0;
                                com.mnemonicstudios.novusapp.j.a[3][com.mnemonicstudios.novusapp.j.Y][com.mnemonicstudios.novusapp.j.Z] = 0;
                            }
                        }
                        break;
                    }
                    catch (Exception exception) {
                        Exception exception2 = exception;
                        exception.printStackTrace();
                        break;
                    }
                }
                case 2: {
                    for (ab = 0; ab < 16; ++ab) {
                        for (aa = 0; aa < 32; ++aa) {
                            com.mnemonicstudios.novusapp.j.a[1][com.mnemonicstudios.novusapp.j.aa][com.mnemonicstudios.novusapp.j.ab] = (aa & 3) + ((ab & 3) << 2) + (this.ah << 4) + 512;
                        }
                    }
                    break;
                }
                case 4: {
                    try {
                        this.cj = 0;
                        while (this.cj < 1023) {
                            this.cl = 0;
                            while (this.cl < 128) {
                                this.b = 511L;
                                this.ck = 0;
                                while ((long)this.ck < this.b) {
                                    com.mnemonicstudios.novusapp.j.b(this.cj + this.cl, this.ck);
                                    this.ck += 32;
                                }
                                this.cl += 32;
                            }
                            this.cj += 128;
                        }
                        break;
                    }
                    catch (Exception exception) {
                        Exception exception3 = exception;
                        exception.printStackTrace();
                        break;
                    }
                }
                case 5: {
                    Exception exception;
                    try {
                        switch (bM) {
                            case 2: {
                                this.a(300, 350, 128, 2);
                                this.a(800, 250, 128, 2);
                                break;
                            }
                            case 3: {
                                this.a(300, 300, 128, 4);
                                this.a(600, 500, 128, 2);
                                break;
                            }
                            case 1: {
                                this.a(100, 300, 50, 2);
                                this.a(300, 300, 50, 2);
                                this.a(500, 200, 50, 2);
                                this.a(700, 300, 50, 2);
                                this.a(900, 300, 50, 2);
                                break;
                            }
                            case 4: {
                                this.a(100, 300, 30, 2);
                                this.a(300, 300, 30, 2);
                                this.a(500, 200, 30, 2);
                                this.a(700, 300, 30, 2);
                                this.a(900, 300, 30, 2);
                                break;
                            }
                            case 5: {
                                this.a(220, 350, 50, 2);
                                this.a(300, 300, 50, 2);
                                this.a(500, 200, 50, 2);
                                this.a(700, 300, 50, 2);
                                this.a(830, 350, 50, 2);
                                break;
                            }
                            case 6: {
                                this.a(200, 300, 100, 2);
                                this.a(700, 300, 25, 2);
                                this.a(500, 450, 50, 2);
                                break;
                            }
                            case 7: {
                                this.a(100, 300, 25, 2);
                                this.a(300, 350, 25, 2);
                                this.a(500, 200, 25, 2);
                                this.a(700, 300, 25, 2);
                                this.a(900, 300, 25, 2);
                                break;
                            }
                            case 0: {
                                this.a(400, 500, 128, 2);
                                this.a(256, 300, 128, 2);
                            }
                        }
                    }
                    catch (Exception exception4) {
                        exception = exception4;
                        exception4.printStackTrace();
                    }
                    try {
                        Thread.sleep(250L);
                    }
                    catch (Exception exception5) {
                        exception = exception5;
                        exception5.printStackTrace();
                    }
                    break;
                }
                case 6: {
                    Exception exception;
                    try {
                        switch (bM) {
                            case 2: {
                                this.a(700, 350, 128, 2);
                                break;
                            }
                            case 3: {
                                this.a(300, 500, 128, 2);
                                this.a(750, 300, 128, 4);
                                break;
                            }
                            case 1: {
                                this.a(200, 400, 100, 2);
                                this.a(400, 250, 50, 2);
                                this.a(600, 250, 50, 2);
                                this.a(800, 400, 100, 2);
                                break;
                            }
                            case 4: {
                                this.a(200, 450, 50, 2);
                                this.a(400, 250, 30, 2);
                                this.a(600, 250, 30, 2);
                                this.a(800, 450, 50, 2);
                                this.a(500, 450, 50, 2);
                                break;
                            }
                            case 5: {
                                this.a(200, 450, 50, 2);
                                this.a(400, 250, 50, 2);
                                this.a(600, 250, 50, 2);
                                this.a(800, 450, 50, 2);
                                this.a(500, 450, 50, 2);
                                break;
                            }
                            case 6: {
                                this.a(600, 250, 25, 2);
                                this.a(800, 200, 100, 2);
                                break;
                            }
                            case 7: {
                                this.a(200, 300, 25, 2);
                                this.a(400, 150, 25, 2);
                                this.a(600, 250, 25, 2);
                                this.a(800, 100, 25, 2);
                                this.a(500, 450, 50, 2);
                                break;
                            }
                            case 0: {
                                this.a(600, 500, 128, 2);
                                this.a(768, 300, 128, 2);
                            }
                        }
                    }
                    catch (Exception exception6) {
                        exception = exception6;
                        exception6.printStackTrace();
                    }
                    try {
                        Thread.sleep(250L);
                    }
                    catch (Exception exception7) {
                        exception = exception7;
                        exception7.printStackTrace();
                    }
                    break;
                }
                case 7: {
                    try {
                        this.f();
                    }
                    catch (Exception exception) {}
                    break;
                }
                case 8: {
                    if (this.e) break;
                    com.mnemonicstudios.novusapp.n.a.a(0);
                    break;
                }
                case 9: {
                    if (this.e) break;
                    com.mnemonicstudios.novusapp.n.a.a(1);
                    break;
                }
                case 10: {
                    if (this.e) break;
                    com.mnemonicstudios.novusapp.n.a.a(2);
                    break;
                }
                case 11: {
                    if (this.e) break;
                    com.mnemonicstudios.novusapp.n.a.a(3);
                    try {
                        Thread.sleep(250L);
                    }
                    catch (Exception exception) {
                        Exception exception8 = exception;
                        exception.printStackTrace();
                    }
                    break;
                }
                case 12: {
                    if (this.e) break;
                    this.cj = 1;
                    while (this.cj < 512) {
                        this.cl = 1;
                        while (this.cl < 511) {
                            this.al = com.mnemonicstudios.novusapp.j.b(this.cj - 1, this.cl);
                            this.am = com.mnemonicstudios.novusapp.j.b(this.cj + 1, this.cl);
                            ay = com.mnemonicstudios.novusapp.j.b(this.cj, this.cl);
                            if (this.al == this.am && ay != this.al) {
                                if (this.al == 0) {
                                    com.mnemonicstudios.novusapp.j.a(this.cj, this.cl);
                                } else {
                                    com.mnemonicstudios.novusapp.j.c(this.cj, this.cl);
                                }
                            }
                            ++this.cl;
                        }
                        ++this.cj;
                    }
                    try {
                        Thread.sleep(250L);
                    }
                    catch (Exception exception) {
                        Exception exception9 = exception;
                        exception.printStackTrace();
                    }
                    break;
                }
                case 13: {
                    if (this.e) break;
                    this.cj = 511;
                    while (this.cj < 1023) {
                        this.cl = 1;
                        while (this.cl < 511) {
                            this.al = com.mnemonicstudios.novusapp.j.b(this.cj - 1, this.cl);
                            this.am = com.mnemonicstudios.novusapp.j.b(this.cj + 1, this.cl);
                            ay = com.mnemonicstudios.novusapp.j.b(this.cj, this.cl);
                            if (this.al == this.am && ay != this.al) {
                                if (this.al == 0) {
                                    com.mnemonicstudios.novusapp.j.a(this.cj, this.cl);
                                } else {
                                    com.mnemonicstudios.novusapp.j.c(this.cj, this.cl);
                                }
                            }
                            ++this.cl;
                        }
                        ++this.cj;
                    }
                    try {
                        Thread.sleep(250L);
                    }
                    catch (Exception exception) {
                        Exception exception10 = exception;
                        exception.printStackTrace();
                    }
                    break;
                }
                case 14: {
                    try {
                        block85: for (ac = 0; ac < 1024; ++ac) {
                            az = com.mnemonicstudios.novusapp.j.b(ac, 0);
                            for (ad = 1; ad < 512; ++ad) {
                                ay = com.mnemonicstudios.novusapp.j.b(ac, ad);
                                if (ay != az && ay == 0) {
                                    com.mnemonicstudios.novusapp.j.a[com.mnemonicstudios.novusapp.j.ac] = (short)ad;
                                    continue block85;
                                }
                                az = ay;
                            }
                        }
                        az = a[0];
                        for (bp = 1; bp < 1023; ++bp) {
                            ay = a[bp];
                            aA = ay - az;
                            this.c(bp, ay, aA);
                            az = ay;
                        }
                        break;
                    }
                    catch (Exception exception) {
                        Exception exception11 = exception;
                        exception.printStackTrace();
                        break;
                    }
                }
                case 15: {
                    try {
                        this.f();
                    }
                    catch (Exception exception) {}
                    try {
                        Thread.sleep(250L);
                        com.mnemonicstudios.novusapp.j.h(0, 0, 32, 16);
                    }
                    catch (Exception exception) {
                        Exception exception12 = exception;
                        exception.printStackTrace();
                    }
                    break;
                }
                case 16: {
                    try {
                        Thread.sleep(250L);
                    }
                    catch (Exception exception) {
                        Exception exception13 = exception;
                        exception.printStackTrace();
                    }
                    if (this.l || this.e) break;
                    this.h();
                    break;
                }
                case 17: {
                    if (this.l || this.e) break;
                    this.h();
                    break;
                }
                case 18: {
                    if (this.l || this.e) break;
                    this.h();
                    break;
                }
                case 19: {
                    com.mnemonicstudios.novusapp.j.h(0, 0, 32, 16);
                    try {
                        Thread.sleep(250L);
                        break;
                    }
                    catch (Exception exception) {
                        Exception exception14 = exception;
                        exception.printStackTrace();
                    }
                }
            }
        }
        catch (Exception exception) {}
        ++this.ai;
        return this.ai == 20;
    }

    public final void f() {
        this.an = 0;
        while (this.an < 44) {
            com.mnemonicstudios.novusapp.j.d[this.an][0] = -1;
            com.mnemonicstudios.novusapp.j.d[this.an][1] = 0;
            com.mnemonicstudios.novusapp.j.d[this.an][2] = 0;
            this.ag = 0;
            while (this.ag < 1024) {
                com.mnemonicstudios.novusapp.j.c[this.an][this.ag] = 0;
                ++this.ag;
            }
            ++this.an;
        }
    }

    public final void g() {
        try {
            for (af = 0; af < 16; ++af) {
                for (ae = 0; ae < 32; ++ae) {
                    com.mnemonicstudios.novusapp.j.a[1][com.mnemonicstudios.novusapp.j.ae][com.mnemonicstudios.novusapp.j.af] = a[1][ae][af] & 0xFF00FFFF;
                }
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final void h(int n2, int n3, int n4, int n5) {
        if (n2 < 0) {
            n2 = 0;
        }
        if (n3 < 0) {
            n3 = 0;
        }
        for (af = n3; af < n5; ++af) {
            for (ae = n2; ae < n4; ++ae) {
                try {
                    com.mnemonicstudios.novusapp.j.e(ae, af);
                    continue;
                }
                catch (Exception exception) {
                    Exception exception2 = exception;
                    exception.printStackTrace();
                }
            }
        }
    }

    public final void h() {
        this.aq = 20;
        this.ao = com.mnemonicstudios.novusapp.n.a(26) + 4;
        this.ap = 0;
        while (this.aq > 0) {
            switch (this.a(this.ao, this.ap)) {
                case 0: {
                    ++this.ap;
                    break;
                }
                case 1: {
                    this.b(this.ah + com.mnemonicstudios.novusapp.n.a(2) + 1, this.ao << 5, this.ap << 5);
                    this.aq = -1;
                    break;
                }
                case 2: {
                    this.ao = com.mnemonicstudios.novusapp.n.a(24) + 4;
                    this.ap = 0;
                    --this.aq;
                }
            }
        }
    }

    public final int a(int n2, int n3) {
        if (n3 > 12) {
            return 2;
        }
        try {
            this.ar = 0;
            this.as = 0;
            this.at = 0;
            this.au = 0;
            this.av = 0;
            while (this.av < 4) {
                if (a[2][n2 + this.av][n3] != 0) {
                    return 2;
                }
                if ((a[1][n2 + this.av][n3] & 0xF00) != 0) {
                    ++this.ar;
                }
                if (a[2][n2 + this.av][n3 + 1] != 0) {
                    return 2;
                }
                if ((a[1][n2 + this.av][n3 + 1] & 0xF00) != 0) {
                    ++this.as;
                }
                if (a[2][n2 + this.av][n3 + 2] != 0) {
                    return 2;
                }
                if ((a[1][n2 + this.av][n3 + 2] & 0xF00) != 0) {
                    ++this.at;
                }
                if (a[2][n2 + this.av][n3 + 3] != 0) {
                    return 2;
                }
                if ((a[1][n2 + this.av][n3 + 3] & 0xF00) != 0) {
                    ++this.au;
                }
                ++this.av;
            }
            if (this.ar > 0 || this.as > 0 || this.at > 0) {
                return 2;
            }
            if (this.ar == 0 && this.as == 0 && this.at == 0 && this.au == 0) {
                return 0;
            }
            if (this.ar == 0 && this.as == 0 && this.at == 0 && this.au > 2) {
                return 1;
            }
            return 2;
        }
        catch (Exception exception) {
            return 2;
        }
    }

    public final void b(int n2, int n3, int n4) {
        for (bq = 0; bq < 4; ++bq) {
            for (bp = 0; bp < 4; ++bp) {
                com.mnemonicstudios.novusapp.j.a[2][com.mnemonicstudios.novusapp.j.bp + (n3 >> 5)][com.mnemonicstudios.novusapp.j.bq + (n4 >> 5)] = bp + (bq << 2) + (n2 << 4) + 256;
                try {
                    this.a[n2].getRGB(f, 0, 32, bp << 5, bq << 5, 32, 32);
                }
                catch (Exception exception) {
                    return;
                }
                for (br = 0; br < 32; ++br) {
                    bu = 0;
                    for (bs = 0; bs < 32; ++bs) {
                        this.aw = (n3 & 0xFFFFFFE0) + (bp << 5) + bs;
                        this.ax = (n4 & 0xFFFFFFE0) + (bq << 5) + br;
                        if ((f[bs + (br << 5)] & 0xFF000000) == 0) {
                            bu |= 1 << bs;
                            continue;
                        }
                        aJ = a[this.aw];
                        aI = aJ & 0x1FF;
                        if (this.ax - aI < 0 || this.ax - aI > 19) continue;
                        com.mnemonicstudios.novusapp.j.a[this.aw] = 0;
                    }
                    com.mnemonicstudios.novusapp.j.b[com.mnemonicstudios.novusapp.j.bp + (n3 >> 5)][com.mnemonicstudios.novusapp.j.bq + (n4 >> 5)][com.mnemonicstudios.novusapp.j.br] = b[bp + (n3 >> 5)][bq + (n4 >> 5)][br] & bu;
                }
                com.mnemonicstudios.novusapp.j.a[2][(n3 >> 5) + com.mnemonicstudios.novusapp.j.bp][(n4 >> 5) + com.mnemonicstudios.novusapp.j.bq] = (n2 << 4) + 256 + (bp + (bq << 2));
                com.mnemonicstudios.novusapp.j.a[1][(n3 >> 5) + com.mnemonicstudios.novusapp.j.bp][(n4 >> 5) + com.mnemonicstudios.novusapp.j.bq] = (this.ah << 4) + 256 + (bp + (bq << 2));
            }
        }
    }

    public final void c(int n2, int n3, int n4) {
        com.mnemonicstudios.novusapp.j.a[n2] = n3;
    }

    public final void a(Graphics graphics, int n2, int n3) {
        for (aB = 0; aB < a; ++aB) {
            try {
                aC = aB + n2;
                aE = a[aC];
                if (a[aC] == 0) continue;
                aD = aE & 0x1FF;
                graphics.setClip(aB, aD - n3, 1, 19);
                graphics.drawImage(this.c, aB - (aC & 0x3F), aD - n3, 20);
                continue;
            }
            catch (Exception exception) {}
        }
    }

    public final void b(Graphics graphics, int n2, int n3) {
        for (aB = 0; aB < 320; ++aB) {
            try {
                aC = aB + n2;
                aE = a[aC];
                if (a[aC] == 0) continue;
                aD = aE & 0x1FF;
                graphics.setClip(aD - n3 - 1, 320 - aB - 1, 19, 1);
                graphics.drawImage(this.d, aD - n3 - 1, 320 - aB - 1, 20);
                continue;
            }
            catch (Exception exception) {}
        }
    }

    public final void c(Graphics graphics, int n2, int n3) {
        for (aB = 0; aB < a; ++aB) {
            try {
                aC = aB + n2;
                aE = a[aC];
                if (a[aC] == 0) continue;
                aD = aE & 0x1FF;
                graphics.setClip(240 - aD + n3, aB, 19, 1);
                graphics.drawImage(this.e, 240 - aD + n3, aB, 20);
                continue;
            }
            catch (Exception exception) {}
        }
    }

    public static final void a(int n2, int n3) {
        if (n3 > 511) {
            return;
        }
        if (n3 < 0) {
            return;
        }
        if (n2 < 0) {
            return;
        }
        if (n2 > 1023) {
            return;
        }
        try {
            if (a[1][n2 >> 5][n3 >> 5] >> 8 == 0) {
                return;
            }
            com.mnemonicstudios.novusapp.j.b[n2 >> 5][n3 >> 5][n3 & 0x1F] = b[n2 >> 5][n3 >> 5][n3 & 0x1F] | 1 << (n2 & 0x1F);
            com.mnemonicstudios.novusapp.j.a[1][n2 >> 5][n3 >> 5] = a[1][n2 >> 5][n3 >> 5] & 0xFF | 0x100;
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final void b(int n2, int n3) {
        if (n3 > 511) {
            return;
        }
        if (n3 < 0) {
            return;
        }
        if (n2 < 0) {
            return;
        }
        if (n2 > 1023) {
            return;
        }
        try {
            if (a[1][n2 >> 5][n3 >> 5] >> 8 == 0) {
                return;
            }
            for (aF = 0; aF < 32; ++aF) {
                com.mnemonicstudios.novusapp.j.b[n2 >> 5][n3 >> 5][com.mnemonicstudios.novusapp.j.aF] = -1;
            }
            com.mnemonicstudios.novusapp.j.a[1][n2 >> 5][n3 >> 5] = a[1][n2 >> 5][n3 >> 5] & 0xFF | 0x100;
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final int b(int n2, int n3) {
        if (n3 > 511) {
            return 0;
        }
        if (n3 < 0) {
            return 0;
        }
        if (n2 < 0) {
            return 0;
        }
        if (n2 > 1023) {
            return 0;
        }
        try {
            aG = a[1][n2 >> 5][n3 >> 5] >> 8 & 0xF;
            if (aG == 0) {
                return 1;
            }
            if (aG == 2) {
                return 0;
            }
            return b[n2 >> 5][n3 >> 5][n3 & 0x1F] >> (n2 & 0x1F) & 1;
        }
        catch (Exception exception) {
            return 0;
        }
    }

    public static final void c(int n2, int n3) {
        try {
            if (n3 > 511) {
                return;
            }
            if (n3 < 0) {
                return;
            }
            if (n2 < 0) {
                return;
            }
            if (n2 > 1023) {
                return;
            }
            com.mnemonicstudios.novusapp.j.b[n2 >> 5][n3 >> 5][n3 & 0x1F] = b[n2 >> 5][n3 >> 5][n3 & 0x1F] & -1 - (1 << (n2 & 0x1F));
            com.mnemonicstudios.novusapp.j.a[1][n2 >> 5][n3 >> 5] = a[1][n2 >> 5][n3 >> 5] & 0xFF | 0x100;
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final void d(int n2, int n3) {
        try {
            if (n3 > 511) {
                return;
            }
            if (n3 < 0) {
                return;
            }
            if (n2 < 0) {
                return;
            }
            if (n2 > 1023) {
                return;
            }
            com.mnemonicstudios.novusapp.j.b[n2 >> 5][n3 >> 5][n3 & 0x1F] = 0;
            com.mnemonicstudios.novusapp.j.a[1][n2 >> 5][n3 >> 5] = a[1][n2 >> 5][n3 >> 5] & 0xFF | 0x100;
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final void e(int n2, int n3) {
        if (a[1][n2][n3] >> 8 == 0) {
            return;
        }
        g = false;
        h = false;
        for (aH = 0; aH < 32; ++aH) {
            if (b[n2][n3][aH] != -1) {
                g = true;
            }
            if (b[n2][n3][aH] == 0) continue;
            h = true;
        }
        if (!g) {
            com.mnemonicstudios.novusapp.j.a[1][n2][n3] = a[1][n2][n3] & 0xFF;
            return;
        }
        if (!h) {
            com.mnemonicstudios.novusapp.j.a[1][n2][n3] = a[1][n2][n3] & 0xFF | 0x200;
        }
    }

    public static final void d(int n2, int n3, int n4) {
        try {
            if (n2 == n3) {
                return;
            }
            if (n4 < 0) {
                return;
            }
            if (n4 > 512) {
                return;
            }
            if (n2 < 0) {
                n2 = 0;
            }
            if (n3 < 0) {
                n3 = 0;
            }
            if (n2 > 1024) {
                n2 = 1024;
            }
            if (n3 > 1024) {
                n3 = 1024;
            }
            if (n2 > n3) {
                aW = n3;
                aX = n2;
            } else {
                aW = n2;
                aX = n3;
            }
            for (aV = aW; aV < aX; ++aV) {
                com.mnemonicstudios.novusapp.j.a(aV, n4);
                try {
                    aJ = a[aV];
                    aI = aJ & 0x1FF;
                    if (n4 - aI < 0 || n4 - aI > 19) continue;
                    try {
                        com.mnemonicstudios.novusapp.j.a[com.mnemonicstudios.novusapp.j.aV] = 0;
                    }
                    catch (Exception exception) {}
                    continue;
                }
                catch (Exception exception) {}
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public static final void e(int n2, int n3, int n4) {
        if (n3 == n4) {
            return;
        }
        if (n2 < 0) {
            return;
        }
        if (n2 > 1024) {
            return;
        }
        if (n3 < 0) {
            n3 = 0;
        }
        if (n4 < 0) {
            n4 = 0;
        }
        if (n3 > 512) {
            n3 = 512;
        }
        if (n4 > 512) {
            n4 = 512;
        }
        if (n3 > n4) {
            aK = n4;
            aL = n3;
        } else {
            aK = n3;
            aL = n4;
        }
        for (aV = aK; aV < aL; ++aV) {
            com.mnemonicstudios.novusapp.j.a(n2, aV);
        }
    }

    public static final void f(int n2, int n3, int n4) {
        if (n2 == n3) {
            return;
        }
        if (n4 < 0) {
            return;
        }
        if (n4 >= 512) {
            return;
        }
        if (n2 < 0) {
            n2 = 0;
        }
        if (n3 < 0) {
            n3 = 0;
        }
        if (n2 > 1024) {
            n2 = 1024;
        }
        if (n3 > 1024) {
            n3 = 1024;
        }
        if (n2 > n3) {
            aW = n3;
            aX = n2;
        } else {
            aW = n2;
            aX = n3;
        }
        if (aX - aW < 32) {
            for (aV = aW; aV < aX; ++aV) {
                com.mnemonicstudios.novusapp.j.c(aV, n4);
            }
        } else {
            aM = 31 - (aW & 0x1F);
            aN = aX & 0x1F;
            aO = aX - aN - (aW + aM) & 0xFFFFE1;
            for (aV = aW; aV <= aW + aM; ++aV) {
                com.mnemonicstudios.novusapp.j.c(aV, n4);
            }
            for (aV = aW + aM + 1; aV < aW + aM + aO; aV += 32) {
                com.mnemonicstudios.novusapp.j.d(aV, n4);
            }
            for (aV = aX - aN; aV < aX; ++aV) {
                com.mnemonicstudios.novusapp.j.c(aV, n4);
            }
        }
    }

    public final void i() {
        this.aP = 0;
        while (this.aP < this.b.length) {
            this.b[this.aP] = 0;
            this.c[this.aP] = 0;
            this.d[this.aP] = 0;
            this.e[this.aP] = 0;
            ++this.aP;
        }
    }

    public final void g(int n2, int n3, int n4) {
        this.aP = 0;
        while (this.aP < this.b.length) {
            if (this.b[this.aP] < 1) {
                this.b[this.aP] = 6;
                this.c[this.aP] = n2;
                this.d[this.aP] = n3;
                this.e[this.aP] = n4;
                return;
            }
            ++this.aP;
        }
    }

    public final void j() {
        this.aP = 0;
        while (this.aP < this.b.length) {
            if (this.b[this.aP] > 0) {
                if (this.b[this.aP] > 2) {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.k, this.c[this.aP], this.d[this.aP] + this.e[this.aP], 5 - this.b[this.aP], 0);
                } else {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.k, this.c[this.aP], this.d[this.aP] + this.e[this.aP], this.b[this.aP], 0);
                }
            }
            ++this.aP;
        }
    }

    public final void k() {
        this.aP = 0;
        while (this.aP < this.b.length) {
            if (this.b[this.aP] > 0) {
                int n2 = this.aP;
                this.b[n2] = this.b[n2] - 1;
                if (this.b[this.aP] == 3) {
                    com.mnemonicstudios.novusapp.j.i(this.c[this.aP], this.d[this.aP], this.e[this.aP]);
                }
            }
            ++this.aP;
        }
    }

    public static final void h(int n2, int n3, int n4) {
        com.mnemonicstudios.novusapp.n.a.a(bJ, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -(2 + com.mnemonicstudios.novusapp.n.a(6)) << 16, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bI, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -com.mnemonicstudios.novusapp.n.a(6) << 16, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bH, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -(2 + com.mnemonicstudios.novusapp.n.a(6)) << 16, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bJ, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -(2 + com.mnemonicstudios.novusapp.n.a(6)) << 16, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bI, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -(2 + com.mnemonicstudios.novusapp.n.a(6)) << 16, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bH, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -(2 + com.mnemonicstudios.novusapp.n.a(6)) << 16, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bJ, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -(2 + com.mnemonicstudios.novusapp.n.a(6)) << 16, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bJ, n2, n3, com.mnemonicstudios.novusapp.n.a(8) - 4 << 16, -(2 + com.mnemonicstudios.novusapp.n.a(6)) << 16, 20, 0);
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
        com.mnemonicstudios.novusapp.j.f(n2 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4), n3 + (com.mnemonicstudios.novusapp.n.a(n4 << 1) - n4));
    }

    public static final void f(int n2, int n3) {
        com.mnemonicstudios.novusapp.n.a.a(bF, n2 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bF, n2 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bF, n2 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
        com.mnemonicstudios.novusapp.n.a.a(bF, n2 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, -131072, 20, 0);
    }

    public static final void g(int n2, int n3) {
        com.mnemonicstudios.novusapp.n.a.a(bG, n2 + (com.mnemonicstudios.novusapp.n.a(8) - 4), n3 + (com.mnemonicstudios.novusapp.n.a(8) - 4), 0, 0, 80, 0);
    }

    public static final void i(int n2, int n3, int n4) {
        if (n3 < -n4) {
            return;
        }
        if (n2 < -n4) {
            return;
        }
        if (n2 > 1023 + n4) {
            return;
        }
        if (n3 > 511 + n4) {
            return;
        }
        com.mnemonicstudios.novusapp.j.h(n2, n3, n4);
        aQ = 1 - n4;
        aR = 0;
        aS = -2 * n4;
        aT = 0;
        aU = n4;
        com.mnemonicstudios.novusapp.j.d(n2 - n4, n2 + n4, n3);
        while (aT < aU) {
            if (aQ >= 0) {
                --aU;
                aQ += (aS += 2);
            }
            aQ += (aR += 2) + 1;
            com.mnemonicstudios.novusapp.j.d(n2 - ++aT, n2 + aT, n3 + aU);
            com.mnemonicstudios.novusapp.j.d(n2 - aT, n2 + aT, n3 - aU);
            com.mnemonicstudios.novusapp.j.d(n2 - aU, n2 + aU, n3 + aT);
            com.mnemonicstudios.novusapp.j.d(n2 - aU, n2 + aU, n3 - aT);
        }
        com.mnemonicstudios.novusapp.j.h(0, 0, 32, 16);
    }

    public final void a(int n2, int n3, int n4, int n5, int n6) {
        this.W = 2;
    }

    public final void b(Graphics graphics) {
        this.bA = com.mnemonicstudios.novusapp.n.a.c();
        this.bB = com.mnemonicstudios.novusapp.n.a.d();
        this.bv = this.bm;
        this.bw = this.bm;
        by = b / this.bw + 2;
        bx = a / this.bv + 2;
        this.bi = this.bA / this.bv;
        this.bj = this.bB / this.bw;
        this.bk = this.bA - this.bA / this.bv * this.bv;
        this.bl = this.bB - this.bB / this.bw * this.bw;
        graphics.setClip(0, 0, 240, 320);
        this.bn = 1;
        while (this.bn < 2) {
            this.bc = -this.bl;
            this.ba = 0;
            while (this.ba < by) {
                this.bb = -this.bk;
                this.aZ = 0;
                while (this.aZ < bx) {
                    block80: {
                        try {
                            this.bd = a[this.bn][this.aZ + this.bi][this.ba + this.bj];
                            this.bf = a[this.bn + 1][this.aZ + this.bi][this.ba + this.bj];
                            this.bC = a[this.bn + 2][this.aZ + this.bi][this.ba + this.bj];
                        }
                        catch (Exception exception) {
                            this.bd = 0;
                        }
                        this.be = this.bd >> 4 & 0xF;
                        this.bo = this.bd >> 8 & 0xF;
                        this.bz = this.bd >> 16 & 0xFF;
                        this.bd &= 0xF;
                        this.bg = this.bf >> 4 & 0xF;
                        this.bf &= 0xF;
                        this.bh = this.bf >> 8 & 0xF;
                        if (this.bo == 0) {
                            this.bo = this.bh;
                        }
                        if (this.bC != 0 && this.bo == 0) {
                            this.bo = 1;
                        }
                        if (this.be == 15) break block80;
                        try {
                            block9 : switch (this.bo) {
                                case 0: {
                                    break;
                                }
                                case 1: {
                                    if (this.bz > 0) {
                                        switch (c) {
                                            case 0: {
                                                graphics.drawRGB(c[this.bz], 0, 32, this.bb, this.bc, 32, 32, true);
                                                break block9;
                                            }
                                            case 2: {
                                                graphics.drawRGB(c[this.bz], 0, 32, 240 - this.bc - 16, this.bb, 32, 32, true);
                                                break block9;
                                            }
                                            case 1: {
                                                graphics.drawRGB(c[this.bz], 0, 32, this.bc, 320 - this.bb - 32, 32, 32, true);
                                            }
                                        }
                                        break;
                                    }
                                    this.bz = aY = com.mnemonicstudios.novusapp.n.a(42) + 1;
                                    if (d[aY][0] >= 0) {
                                        com.mnemonicstudios.novusapp.j.a[com.mnemonicstudios.novusapp.j.d[com.mnemonicstudios.novusapp.j.aY][0]][com.mnemonicstudios.novusapp.j.d[com.mnemonicstudios.novusapp.j.aY][1]][com.mnemonicstudios.novusapp.j.d[com.mnemonicstudios.novusapp.j.aY][2]] = a[d[aY][0]][d[aY][1]][d[aY][2]] & 0xFFFF;
                                        com.mnemonicstudios.novusapp.j.d[com.mnemonicstudios.novusapp.j.aY][0] = -1;
                                    }
                                    com.mnemonicstudios.novusapp.j.a[this.bn][this.aZ + this.bi][this.ba + this.bj] = a[this.bn][this.aZ + this.bi][this.ba + this.bj] & 0xFFFF | this.bz << 16;
                                    com.mnemonicstudios.novusapp.j.d[com.mnemonicstudios.novusapp.j.aY][0] = this.bn;
                                    com.mnemonicstudios.novusapp.j.d[com.mnemonicstudios.novusapp.j.aY][1] = this.aZ + this.bi;
                                    com.mnemonicstudios.novusapp.j.d[com.mnemonicstudios.novusapp.j.aY][2] = this.ba + this.bj;
                                    bp = this.aZ + this.bi;
                                    bq = this.ba + this.bj;
                                    switch (c) {
                                        case 0: {
                                            try {
                                                this.a[this.be].getRGB(c[this.bz], 0, 32, (this.bd & 3) << 5, this.bd >> 2 << 5, 32, 32);
                                            }
                                            catch (Exception exception) {
                                                return;
                                            }
                                            if (this.bg > 0) {
                                                try {
                                                    this.a[this.bg].getRGB(h, 0, 32, (this.bf & 3) << 5, this.bf >> 2 << 5, 32, 32);
                                                }
                                                catch (Exception exception) {
                                                    return;
                                                }
                                                for (br = 0; br < 32; ++br) {
                                                    for (bs = 0; bs < 32; ++bs) {
                                                        if ((h[(br << 5) + bs] & 0xFF000000) == 0) continue;
                                                        com.mnemonicstudios.novusapp.j.c[this.bz][(com.mnemonicstudios.novusapp.j.br << 5) + com.mnemonicstudios.novusapp.j.bs] = h[(br << 5) + bs];
                                                    }
                                                }
                                            }
                                            if (this.bC > 0) {
                                                try {
                                                    this.a.getRGB(h, 0, 32, 0, 0, 32, 32);
                                                }
                                                catch (Exception exception) {
                                                    return;
                                                }
                                                for (br = 0; br < 32; ++br) {
                                                    for (bs = 0; bs < 32; ++bs) {
                                                        if ((h[(br << 5) + bs] & 0xFF000000) == 0) continue;
                                                        com.mnemonicstudios.novusapp.j.c[this.bz][(com.mnemonicstudios.novusapp.j.br << 5) + com.mnemonicstudios.novusapp.j.bs] = h[(br << 5) + bs];
                                                    }
                                                }
                                            }
                                            block50: for (br = 0; br < 32; ++br) {
                                                bt = b[bp][bq][br];
                                                bu = 1;
                                                for (bs = 0; bs < 32; ++bs) {
                                                    if ((bt & 1) != 0) {
                                                        com.mnemonicstudios.novusapp.j.c[this.bz][(com.mnemonicstudios.novusapp.j.br << 5) + com.mnemonicstudios.novusapp.j.bs] = 0;
                                                    }
                                                    if ((bt >>= 1) == 0) continue block50;
                                                }
                                            }
                                            graphics.drawRGB(c[this.bz], 0, 32, this.bb, this.bc, 32, 32, true);
                                            break block9;
                                        }
                                        case 2: {
                                            try {
                                                this.a[this.be].getRGB(g, 0, 32, (this.bd & 3) << 5, this.bd >> 2 << 5, 32, 32);
                                            }
                                            catch (Exception exception) {
                                                return;
                                            }
                                            for (br = 0; br < 32; ++br) {
                                                for (bs = 0; bs < 32; ++bs) {
                                                    com.mnemonicstudios.novusapp.j.c[this.bz][(com.mnemonicstudios.novusapp.j.bs << 5) + (31 - com.mnemonicstudios.novusapp.j.br)] = g[(br << 5) + bs];
                                                }
                                            }
                                            if (this.bg > 0) {
                                                try {
                                                    this.a[this.bg].getRGB(h, 0, 32, (this.bf & 3) << 5, this.bf >> 2 << 5, 32, 32);
                                                }
                                                catch (Exception exception) {
                                                    return;
                                                }
                                                for (br = 0; br < 32; ++br) {
                                                    for (bs = 0; bs < 32; ++bs) {
                                                        if ((h[(br << 5) + bs] & 0xFF000000) == 0) continue;
                                                        com.mnemonicstudios.novusapp.j.c[this.bz][(com.mnemonicstudios.novusapp.j.bs << 5) + (31 - com.mnemonicstudios.novusapp.j.br)] = h[(br << 5) + bs];
                                                    }
                                                }
                                            }
                                            block56: for (br = 0; br < 32; ++br) {
                                                bt = b[bp][bq][br];
                                                bu = 1;
                                                for (bs = 0; bs < 32; ++bs) {
                                                    if ((bt & 1) != 0) {
                                                        com.mnemonicstudios.novusapp.j.c[this.bz][(com.mnemonicstudios.novusapp.j.bs << 5) + (31 - com.mnemonicstudios.novusapp.j.br)] = 0;
                                                    }
                                                    if ((bt >>= 1) == 0) continue block56;
                                                }
                                            }
                                            graphics.drawRGB(c[this.bz], 0, 32, 240 - this.bc - 16, this.bb, 32, 32, true);
                                            break block9;
                                        }
                                        case 1: {
                                            try {
                                                this.a[this.be].getRGB(g, 0, 32, (this.bd & 3) << 5, this.bd >> 2 << 5, 32, 32);
                                            }
                                            catch (Exception exception) {
                                                return;
                                            }
                                            for (br = 0; br < 32; ++br) {
                                                for (bs = 0; bs < 32; ++bs) {
                                                    com.mnemonicstudios.novusapp.j.c[this.bz][(31 - com.mnemonicstudios.novusapp.j.bs << 5) + com.mnemonicstudios.novusapp.j.br] = g[(br << 5) + bs];
                                                }
                                            }
                                            if (this.bg > 0) {
                                                try {
                                                    this.a[this.bg].getRGB(h, 0, 32, (this.bf & 3) << 5, this.bf >> 2 << 5, 32, 32);
                                                }
                                                catch (Exception exception) {
                                                    return;
                                                }
                                                for (br = 0; br < 32; ++br) {
                                                    for (bs = 0; bs < 32; ++bs) {
                                                        if ((h[(br << 5) + bs] & 0xFF000000) == 0) continue;
                                                        com.mnemonicstudios.novusapp.j.c[this.bz][(com.mnemonicstudios.novusapp.j.bs << 5) + (31 - com.mnemonicstudios.novusapp.j.br)] = h[(br << 5) + bs];
                                                    }
                                                }
                                            }
                                            block62: for (br = 0; br < 32; ++br) {
                                                bt = b[bp][bq][br];
                                                bu = 1;
                                                for (bs = 0; bs < 32; ++bs) {
                                                    if ((bt & 1) != 0) {
                                                        com.mnemonicstudios.novusapp.j.c[this.bz][(31 - com.mnemonicstudios.novusapp.j.bs << 5) + com.mnemonicstudios.novusapp.j.br] = 0;
                                                    }
                                                    if ((bt >>= 1) == 0) continue block62;
                                                }
                                            }
                                            graphics.drawRGB(c[this.bz], 0, 32, this.bc, 320 - this.bb - 32, 32, 32, true);
                                        }
                                    }
                                    break;
                                }
                                case 2: {
                                    switch (c) {
                                        case 0: {
                                            if (this.bg > 0) {
                                                this.a[this.bg].setFrame(this.bf);
                                                this.a[this.bg].setTransform(0);
                                                this.a[this.bg].setPosition(this.bb, this.bc);
                                                this.a[this.bg].paint(graphics);
                                            } else {
                                                this.a[this.be].setFrame(this.bd);
                                                this.a[this.be].setTransform(0);
                                                this.a[this.be].setPosition(this.bb, this.bc);
                                                this.a[this.be].paint(graphics);
                                            }
                                            if (this.bC > 0) {
                                                graphics.drawImage(this.a, this.bb, this.bc, 20);
                                                break block9;
                                            }
                                            break block80;
                                        }
                                        case 2: {
                                            if (this.bg > 0) {
                                                this.a[this.bg].setFrame(this.bf);
                                                this.a[this.bg].setTransform(5);
                                                this.a[this.bg].setPosition(240 - this.bc - 16, this.bb);
                                                this.a[this.bg].paint(graphics);
                                                break block9;
                                            }
                                            this.a[this.be].setFrame(this.bd);
                                            this.a[this.be].setTransform(5);
                                            this.a[this.be].setPosition(240 - this.bc - 16, this.bb);
                                            this.a[this.be].paint(graphics);
                                            break block9;
                                        }
                                        case 1: {
                                            this.a[this.be].setFrame(this.bd);
                                            this.a[this.be].setTransform(6);
                                            this.a[this.be].setPosition(this.bc, 320 - this.bb - 32);
                                            this.a[this.be].paint(graphics);
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception exception) {
                            Exception exception2 = exception;
                            exception.printStackTrace();
                        }
                    }
                    this.bb += this.bv;
                    ++this.aZ;
                }
                this.bc += this.bw;
                ++this.ba;
            }
            if (this.bn == 1 && (this.ce & 1) == 0) {
                switch (c) {
                    case 0: {
                        this.a(graphics, this.bA, this.bB);
                        break;
                    }
                    case 2: {
                        this.c(graphics, this.bA, this.bB);
                        break;
                    }
                    case 1: {
                        this.b(graphics, this.bA, this.bB);
                    }
                }
            }
            graphics.setClip(0, 0, 240, 320);
            ++this.bn;
        }
    }

    public final void a(boolean bl, int n2, int n3) {
        this.i = bl;
        this.bD = n2;
        this.bE = n3;
        this.W = 4;
        this.j = true;
    }

    public final void l() {
        if (!this.k) {
            com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 142, 115, 93, 106, 87, 70, 20);
            bH = com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 100, 100, 255, 50, 50, 175, 20);
            bI = com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 255, 255, 0, 150, 150, 0, 20);
            bJ = com.mnemonicstudios.novusapp.n.a.a(7, 0, 8, 3, 255, 60, 60, 100, 30, 30, 20);
            bF = com.mnemonicstudios.novusapp.n.a.a(3, 0, 8, 3, 192, 192, 192, 64, 64, 64, 20);
            bG = com.mnemonicstudios.novusapp.n.a.a(3, 0, 8, 3, 192, 192, 192, 64, 64, 64, 80);
            this.k = true;
        }
        com.mnemonicstudios.novusapp.n.a.a(0);
        com.mnemonicstudios.novusapp.n.a.a(1);
        com.mnemonicstudios.novusapp.n.a.a(2);
        com.mnemonicstudios.novusapp.n.a.a(3);
    }

    public final boolean a(int n2, int n3, int n4, int n5, int n6) {
        switch (this.ak) {
            case 0: {
                if (!m) {
                    this.l();
                }
                bK = n3;
                this.ah = n2;
                bM = n3;
                if (n5 == 3) {
                    com.mnemonicstudios.novusapp.g.a = -16384;
                    com.mnemonicstudios.novusapp.r.b = 1;
                } else {
                    com.mnemonicstudios.novusapp.g.a = -65536;
                    com.mnemonicstudios.novusapp.r.b = 2;
                }
                this.i();
                com.mnemonicstudios.novusapp.n.a.a();
                this.l = true;
                bL = this.ah;
                switch (this.ah) {
                    case 0: {
                        this.ah = 1;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(50L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape1_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape1cap.png");
                            this.e = Image.createImage((String)"/worms_landscape1cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception2 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 1: {
                        this.ah = 4;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            Thread.sleep(50L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape2_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape2cap.png");
                            this.e = Image.createImage((String)"/worms_landscape2cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception3 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 2: {
                        this.ah = 7;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(50L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape3_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape3cap.png");
                            this.e = Image.createImage((String)"/worms_landscape3cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception4 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 3: {
                        this.ah = 10;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(50L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape4_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape4cap.png");
                            this.e = Image.createImage((String)"/worms_landscape4cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception5 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 4: {
                        this.ah = 13;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(50L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape5_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape5cap.png");
                            this.e = Image.createImage((String)"/worms_landscape5cap_rev.png");
                            break;
                        }
                        catch (Exception exception) {
                            Exception exception6 = exception;
                            exception.printStackTrace();
                        }
                    }
                }
                ++this.ak;
                break;
            }
            case 1: {
                if (!this.a()) break;
                ++this.ak;
            }
        }
        return this.ak == 2;
    }

    public final void m() {
        this.a = false;
        com.mnemonicstudios.novusapp.g.ar = 0;
        com.mnemonicstudios.novusapp.n.a.am = 0;
        com.mnemonicstudios.novusapp.n.a.al = 0;
        this.y = false;
        this.cc = com.mnemonicstudios.novusapp.n.a.f();
        this.cd = com.mnemonicstudios.novusapp.n.a.g() - 100;
        this.i = false;
        this.j = false;
        this.bD = -1;
        this.W = 1;
        com.mnemonicstudios.novusapp.n.a.j(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 1);
        com.mnemonicstudios.novusapp.n.a.a(this.cc + (a >> 1), this.cd + (b >> 1));
        this.r();
        com.mnemonicstudios.novusapp.n.a.a(0, 2, -1);
        com.mnemonicstudios.novusapp.n.a.a(1, 2, -1);
        com.mnemonicstudios.novusapp.n.a.a(2, 2, -1);
        com.mnemonicstudios.novusapp.n.a.a(3, 2, -1);
        this.i = false;
        this.j = false;
        this.bD = -1;
        com.mnemonicstudios.novusapp.n.a.i();
        this.a(c);
    }

    public final boolean b() {
        this.a = false;
        com.mnemonicstudios.novusapp.g.ar = 0;
        switch (this.aj) {
            case 0: {
                if (!m) {
                    this.l();
                }
                bM = com.mnemonicstudios.novusapp.n.a(8);
                this.y = false;
                com.mnemonicstudios.novusapp.n.a.a();
                com.mnemonicstudios.novusapp.g.a = -65536;
                com.mnemonicstudios.novusapp.r.b = 2;
                this.y = false;
                this.ah = com.mnemonicstudios.novusapp.n.a(5);
                this.i();
                com.mnemonicstudios.novusapp.n.a.a();
                com.mnemonicstudios.novusapp.r.a = 0;
                com.mnemonicstudios.novusapp.n.a.Q = 0;
                this.l = false;
                this.j = false;
                bL = this.ah;
                switch (this.ah) {
                    case 0: {
                        this.ah = 1;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(250L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape1_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape1cap.png");
                            this.e = Image.createImage((String)"/worms_landscape1cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception2 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 1: {
                        this.ah = 4;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            Thread.sleep(250L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape2_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape2cap.png");
                            this.e = Image.createImage((String)"/worms_landscape2cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception3 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 2: {
                        this.ah = 7;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(250L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape3_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape3cap.png");
                            this.e = Image.createImage((String)"/worms_landscape3cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception4 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 3: {
                        this.ah = 10;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(250L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape4_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape4cap.png");
                            this.e = Image.createImage((String)"/worms_landscape4cap_rev.png");
                        }
                        catch (Exception exception) {
                            Exception exception5 = exception;
                            exception.printStackTrace();
                        }
                        break;
                    }
                    case 4: {
                        this.ah = 13;
                        try {
                            com.mnemonicstudios.novusapp.n.a.a = null;
                            com.mnemonicstudios.novusapp.n.a.b = null;
                            this.c = null;
                            System.gc();
                            Thread.sleep(250L);
                            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape5_backdrop.png");
                            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                            this.c = Image.createImage((String)"/worms_landscape5cap.png");
                            this.e = Image.createImage((String)"/worms_landscape5cap_rev.png");
                            break;
                        }
                        catch (Exception exception) {
                            Exception exception6 = exception;
                            exception.printStackTrace();
                        }
                    }
                }
                ++this.aj;
                break;
            }
            case 1: {
                if (!this.a()) break;
                ++this.aj;
                break;
            }
            case 2: {
                com.mnemonicstudios.novusapp.n.a.a(0);
                com.mnemonicstudios.novusapp.n.a.a(1);
                com.mnemonicstudios.novusapp.n.a.a(2);
                com.mnemonicstudios.novusapp.n.a.a(3);
                switch (bK) {
                    case 0: 
                    case 1: {
                        com.mnemonicstudios.novusapp.n.a.a(2, 4, 0, 1, -1, -1);
                        com.mnemonicstudios.novusapp.n.a.a(0, false);
                        com.mnemonicstudios.novusapp.n.a.a(1, false);
                        break;
                    }
                    case 2: {
                        com.mnemonicstudios.novusapp.n.a.a(2, 4, 0, 1, -1, -1);
                        com.mnemonicstudios.novusapp.n.a.a(0, false);
                        com.mnemonicstudios.novusapp.n.a.a(1, true);
                        break;
                    }
                    case 3: {
                        com.mnemonicstudios.novusapp.n.a.a(3, 4, 0, 1, -1, -1);
                        com.mnemonicstudios.novusapp.n.a.a(0, false);
                        com.mnemonicstudios.novusapp.n.a.a(1, true);
                        com.mnemonicstudios.novusapp.n.a.a(2, true);
                        break;
                    }
                    case 4: {
                        com.mnemonicstudios.novusapp.n.a.a(4, 4, 0, 1, -1, -1);
                        com.mnemonicstudios.novusapp.n.a.a(0, false);
                        com.mnemonicstudios.novusapp.n.a.a(1, true);
                        com.mnemonicstudios.novusapp.n.a.a(2, true);
                        com.mnemonicstudios.novusapp.n.a.a(3, true);
                        break;
                    }
                    case 5: {
                        com.mnemonicstudios.novusapp.n.a.a(4, 4, 0, 1, -1, -1);
                        com.mnemonicstudios.novusapp.n.a.a(0, true);
                        com.mnemonicstudios.novusapp.n.a.a(1, true);
                        com.mnemonicstudios.novusapp.n.a.a(2, true);
                        com.mnemonicstudios.novusapp.n.a.a(3, true);
                        break;
                    }
                    case 6: {
                        com.mnemonicstudios.novusapp.n.a.a(4, 4, 0, 1, -1, -1);
                        com.mnemonicstudios.novusapp.n.a.a(0, false);
                        com.mnemonicstudios.novusapp.n.a.a(1, false);
                        com.mnemonicstudios.novusapp.n.a.a(2, false);
                        com.mnemonicstudios.novusapp.n.a.a(3, false);
                        break;
                    }
                    case 7: {
                        com.mnemonicstudios.novusapp.n.a.a(4, 4, 0, 1, -1, -1);
                        com.mnemonicstudios.novusapp.n.a.a(0, false);
                        com.mnemonicstudios.novusapp.n.a.a(1, false);
                        com.mnemonicstudios.novusapp.n.a.a(3, false);
                    }
                }
                com.mnemonicstudios.novusapp.n.a.am = 0;
                com.mnemonicstudios.novusapp.n.a.al = 0;
                com.mnemonicstudios.novusapp.n.a.i();
                this.cc = com.mnemonicstudios.novusapp.n.a.f();
                this.cd = com.mnemonicstudios.novusapp.n.a.g() - 100;
                com.mnemonicstudios.novusapp.n.a.e(4);
                com.mnemonicstudios.novusapp.n.a.e(4);
                com.mnemonicstudios.novusapp.n.a.e(4);
                com.mnemonicstudios.novusapp.n.a.e(4);
                com.mnemonicstudios.novusapp.n.a.e(0);
                com.mnemonicstudios.novusapp.n.a.e(0);
                com.mnemonicstudios.novusapp.n.a.e(0);
                com.mnemonicstudios.novusapp.n.a.e(0);
                com.mnemonicstudios.novusapp.n.a.e(1);
                com.mnemonicstudios.novusapp.n.a.e(1);
                com.mnemonicstudios.novusapp.n.a.e(1);
                com.mnemonicstudios.novusapp.n.a.e(1);
                com.mnemonicstudios.novusapp.n.a.e(2);
                com.mnemonicstudios.novusapp.n.a.e(2);
                com.mnemonicstudios.novusapp.n.a.e(2);
                com.mnemonicstudios.novusapp.n.a.e(2);
                this.i = false;
                this.j = false;
                this.bD = -1;
                this.W = 1;
                com.mnemonicstudios.novusapp.n.a.j(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 1);
                com.mnemonicstudios.novusapp.n.a.a(this.cc + (a >> 1), this.cd + (b >> 1));
                this.r();
                com.mnemonicstudios.novusapp.n.a.a(0, 2, -1);
                com.mnemonicstudios.novusapp.n.a.a(0, 8, 1);
                com.mnemonicstudios.novusapp.n.a.a(0, 1, 1);
                com.mnemonicstudios.novusapp.n.a.a(0, 3, 2);
                com.mnemonicstudios.novusapp.n.a.a(0, 19, 1);
                com.mnemonicstudios.novusapp.n.a.a(0, 20, 1);
                com.mnemonicstudios.novusapp.n.a.a(0, 21, 4);
                com.mnemonicstudios.novusapp.n.a.a(0, 7, 2);
                com.mnemonicstudios.novusapp.n.a.a(0, 9, 2);
                com.mnemonicstudios.novusapp.n.a.a(0, 22, 1);
                com.mnemonicstudios.novusapp.n.a.a(0, 18, -1);
                com.mnemonicstudios.novusapp.n.a.a(0, 6, 4);
                com.mnemonicstudios.novusapp.n.a.a(0, 5, 1);
                com.mnemonicstudios.novusapp.n.a.a(0, 12, 2);
                com.mnemonicstudios.novusapp.n.a.a(0, 11, 1);
                com.mnemonicstudios.novusapp.n.a.a(0, 13, 2);
                com.mnemonicstudios.novusapp.n.a.a(0, 4, 2);
                com.mnemonicstudios.novusapp.n.a.a(0, 14, 3);
                com.mnemonicstudios.novusapp.n.a.a(1, 2, -1);
                com.mnemonicstudios.novusapp.n.a.a(1, 8, 1);
                com.mnemonicstudios.novusapp.n.a.a(1, 1, 1);
                com.mnemonicstudios.novusapp.n.a.a(1, 3, 2);
                com.mnemonicstudios.novusapp.n.a.a(1, 19, 1);
                com.mnemonicstudios.novusapp.n.a.a(1, 20, 1);
                com.mnemonicstudios.novusapp.n.a.a(1, 21, 4);
                com.mnemonicstudios.novusapp.n.a.a(1, 7, 2);
                com.mnemonicstudios.novusapp.n.a.a(1, 9, 2);
                com.mnemonicstudios.novusapp.n.a.a(1, 22, 1);
                com.mnemonicstudios.novusapp.n.a.a(1, 18, -1);
                com.mnemonicstudios.novusapp.n.a.a(1, 6, 4);
                com.mnemonicstudios.novusapp.n.a.a(1, 5, 1);
                com.mnemonicstudios.novusapp.n.a.a(1, 12, 2);
                com.mnemonicstudios.novusapp.n.a.a(1, 11, 1);
                com.mnemonicstudios.novusapp.n.a.a(1, 13, 2);
                com.mnemonicstudios.novusapp.n.a.a(1, 4, 2);
                com.mnemonicstudios.novusapp.n.a.a(1, 14, 3);
                com.mnemonicstudios.novusapp.n.a.a(2, 2, -1);
                com.mnemonicstudios.novusapp.n.a.a(2, 8, 1);
                com.mnemonicstudios.novusapp.n.a.a(2, 1, 1);
                com.mnemonicstudios.novusapp.n.a.a(2, 3, 2);
                com.mnemonicstudios.novusapp.n.a.a(2, 19, 1);
                com.mnemonicstudios.novusapp.n.a.a(2, 20, 1);
                com.mnemonicstudios.novusapp.n.a.a(2, 21, 4);
                com.mnemonicstudios.novusapp.n.a.a(2, 7, 2);
                com.mnemonicstudios.novusapp.n.a.a(2, 9, 2);
                com.mnemonicstudios.novusapp.n.a.a(2, 22, 1);
                com.mnemonicstudios.novusapp.n.a.a(2, 18, -1);
                com.mnemonicstudios.novusapp.n.a.a(2, 6, 4);
                com.mnemonicstudios.novusapp.n.a.a(2, 5, 1);
                com.mnemonicstudios.novusapp.n.a.a(2, 12, 2);
                com.mnemonicstudios.novusapp.n.a.a(2, 11, 1);
                com.mnemonicstudios.novusapp.n.a.a(2, 13, 2);
                com.mnemonicstudios.novusapp.n.a.a(2, 4, 2);
                com.mnemonicstudios.novusapp.n.a.a(2, 14, 3);
                com.mnemonicstudios.novusapp.n.a.a(3, 2, -1);
                com.mnemonicstudios.novusapp.n.a.a(3, 8, 1);
                com.mnemonicstudios.novusapp.n.a.a(3, 1, 1);
                com.mnemonicstudios.novusapp.n.a.a(3, 3, 2);
                com.mnemonicstudios.novusapp.n.a.a(3, 19, 1);
                com.mnemonicstudios.novusapp.n.a.a(3, 20, 1);
                com.mnemonicstudios.novusapp.n.a.a(3, 21, 4);
                com.mnemonicstudios.novusapp.n.a.a(3, 7, 2);
                com.mnemonicstudios.novusapp.n.a.a(3, 9, 2);
                com.mnemonicstudios.novusapp.n.a.a(3, 22, 1);
                com.mnemonicstudios.novusapp.n.a.a(3, 18, -1);
                com.mnemonicstudios.novusapp.n.a.a(3, 6, 4);
                com.mnemonicstudios.novusapp.n.a.a(3, 5, 1);
                com.mnemonicstudios.novusapp.n.a.a(3, 12, 2);
                com.mnemonicstudios.novusapp.n.a.a(3, 11, 1);
                com.mnemonicstudios.novusapp.n.a.a(3, 13, 2);
                com.mnemonicstudios.novusapp.n.a.a(3, 4, 2);
                com.mnemonicstudios.novusapp.n.a.a(3, 14, 3);
                this.a(c);
                ++this.aj;
            }
        }
        return this.aj == 3;
    }

    public final void j(int n2, int n3, int n4) {
        if (this.W == 4) {
            return;
        }
        if (n2 == 0 && n3 == 0) {
            return;
        }
        this.n = true;
        this.W = 3;
        this.bN = n4;
        this.h(n2, n3);
    }

    public final void k(int n2, int n3, int n4) {
        if (this.W == 4) {
            return;
        }
        if (this.y) {
            return;
        }
        this.o = true;
        this.W = 3;
        this.bN = n4;
        this.h(n2, n3);
    }

    private void h(int n2, int n3) {
        if (this.W == 4) {
            return;
        }
        this.W = 3;
        this.bP = n2 - (a >> 1);
        this.bQ = n3 - (b >> 1);
        this.bR = this.cc;
        this.bS = this.cd;
        this.bT = this.bR << 16;
        this.bU = this.bS << 16;
        this.p = false;
        this.bV = Math.abs(this.bR - this.bP) << 11;
        this.bW = Math.abs(this.bS - this.bQ) << 11;
        this.bX = this.bV > this.bW ? (this.bV >> 16) * this.bV : (this.bW >> 16) * this.bW;
        this.bX >>= 14;
        if (this.bX < 64) {
            this.bX = 64;
        }
        this.bY = 0;
        this.bZ = 0;
    }

    public final void n() {
        switch (c) {
            case 0: {
                this.r = com.mnemonicstudios.novusapp.n.k;
                this.s = com.mnemonicstudios.novusapp.n.l;
                this.t = com.mnemonicstudios.novusapp.n.i;
                this.u = com.mnemonicstudios.novusapp.n.j;
                this.v = com.mnemonicstudios.novusapp.n.m;
                this.w = com.mnemonicstudios.novusapp.n.o;
                this.x = com.mnemonicstudios.novusapp.n.p;
                break;
            }
            case 2: {
                this.s = com.mnemonicstudios.novusapp.n.i;
                this.r = com.mnemonicstudios.novusapp.n.j;
                this.t = com.mnemonicstudios.novusapp.n.k;
                this.u = com.mnemonicstudios.novusapp.n.l;
                this.v = com.mnemonicstudios.novusapp.n.m;
                this.w = com.mnemonicstudios.novusapp.n.o;
                this.x = com.mnemonicstudios.novusapp.n.p;
                break;
            }
            case 1: {
                this.r = com.mnemonicstudios.novusapp.n.i;
                this.s = com.mnemonicstudios.novusapp.n.j;
                this.t = com.mnemonicstudios.novusapp.n.l;
                this.u = com.mnemonicstudios.novusapp.n.k;
                this.v = com.mnemonicstudios.novusapp.n.m;
                this.w = com.mnemonicstudios.novusapp.n.o;
                this.x = com.mnemonicstudios.novusapp.n.p;
            }
        }
        if (this.W != 4 && (com.mnemonicstudios.novusapp.n.b() || com.mnemonicstudios.novusapp.n.h)) {
            com.mnemonicstudios.novusapp.n.a.a(this.l);
        }
        if (this.j) {
            this.W = 4;
        }
        switch (this.W) {
            case 0: {
                com.mnemonicstudios.novusapp.n.o = false;
                com.mnemonicstudios.novusapp.n.p = false;
                this.w = false;
                this.x = false;
                if (com.mnemonicstudios.novusapp.n.n) {
                    this.c = true;
                    com.mnemonicstudios.novusapp.g.o = 2;
                } else if (this.c) {
                    this.W = 1;
                    com.mnemonicstudios.novusapp.g.o = 2;
                    this.c = false;
                }
                if (com.mnemonicstudios.novusapp.g.ar == 0) {
                    if (com.mnemonicstudios.novusapp.g.o == 13) {
                        this.X = 16;
                        this.cc = (this.cc & 0xFFFFFFE0) + 22;
                        this.cd &= 0xFFFFFFE0;
                        if (!(this.t || this.u || this.r || this.s)) {
                            this.d = true;
                        }
                    } else {
                        this.X = 4;
                        this.d = true;
                    }
                    if (this.t && this.d) {
                        this.ca += this.X;
                        this.ca &= 0x7F;
                        this.cc -= this.X << 1;
                        if (this.cc < -256) {
                            this.cc = -256;
                        }
                        this.d = false;
                    }
                    if (this.u && this.d) {
                        this.ca -= this.X;
                        this.ca &= 0x7F;
                        this.cc += this.X << 1;
                        if (this.cc > 1280 - a) {
                            this.cc = 1280 - a;
                        }
                        this.d = false;
                    }
                    if (this.s && this.d) {
                        this.cb -= this.X;
                        this.ca &= 0x7F;
                        this.cd += this.X << 1;
                        if (this.cd > 768 - b) {
                            this.cd = 768 - b;
                        }
                        this.d = false;
                    }
                    if (this.r && this.d) {
                        this.cb += this.X;
                        this.ca &= 0x7F;
                        this.cd -= this.X << 1;
                        if (this.cd < -256) {
                            this.cd = -256;
                        }
                        this.d = false;
                    }
                    if (com.mnemonicstudios.novusapp.g.b && !com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a.a(), com.mnemonicstudios.novusapp.n.a.b()) && this.v) {
                        com.mnemonicstudios.novusapp.g.m = com.mnemonicstudios.novusapp.n.a.a();
                        com.mnemonicstudios.novusapp.g.n = com.mnemonicstudios.novusapp.n.a.b();
                        com.mnemonicstudios.novusapp.g.b = false;
                        if (com.mnemonicstudios.novusapp.g.o == 5 || com.mnemonicstudios.novusapp.g.o == 11 || com.mnemonicstudios.novusapp.g.o == 13) {
                            if (com.mnemonicstudios.novusapp.g.o == 13) {
                                if (com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a.a(), com.mnemonicstudios.novusapp.n.a.b(), 9216)) {
                                    this.W = 2;
                                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.g.o, com.mnemonicstudios.novusapp.g.m, -200, 1024, 0);
                                } else {
                                    this.W = 1;
                                }
                            } else {
                                this.W = 2;
                                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.g.o, com.mnemonicstudios.novusapp.g.m, -200, 1024, 0);
                            }
                        } else {
                            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.g.o, com.mnemonicstudios.novusapp.g.m, com.mnemonicstudios.novusapp.g.n, 0, 0);
                        }
                    }
                    this.r = false;
                    this.s = false;
                    this.t = false;
                    this.u = false;
                    this.v = false;
                    com.mnemonicstudios.novusapp.n.a.d();
                }
                com.mnemonicstudios.novusapp.n.a.f();
                if (com.mnemonicstudios.novusapp.n.a.e() >= 0) break;
                com.mnemonicstudios.novusapp.n.a.d(0, 0);
                break;
            }
            case 3: {
                com.mnemonicstudios.novusapp.r.a = false;
                if (this.n) {
                    if (!this.p) {
                        if (this.bR < this.bP) {
                            this.bY += this.bV >> 3;
                            if (this.bY > this.bV) {
                                this.bY = this.bV;
                            }
                        }
                        if (this.bR > this.bP) {
                            this.bY -= this.bV >> 3;
                            if (this.bY < -this.bV) {
                                this.bY = -this.bV;
                            }
                        }
                        if (this.bS < this.bQ) {
                            this.bZ += this.bW >> 3;
                            if (this.bZ > this.bW) {
                                this.bZ = this.bW;
                            }
                        }
                        if (this.bS > this.bQ) {
                            this.bZ -= this.bW >> 3;
                            if (this.bZ < -this.bW) {
                                this.bZ = -this.bW;
                            }
                        }
                        this.bT += this.bY;
                        this.bU += this.bZ;
                    } else if (Math.abs(this.bR - this.bP) > 8 && Math.abs(this.bS - this.bQ) > 8) {
                        if (this.bR < this.bP) {
                            this.bT += 196608;
                        }
                        if (this.bR > this.bP) {
                            this.bT -= 196608;
                        }
                        if (this.bS < this.bQ) {
                            this.bU += 196608;
                        }
                        if (this.bS > this.bQ) {
                            this.bU -= 196608;
                        }
                    } else {
                        if (this.bR < this.bP) {
                            this.bT += 65536;
                        }
                        if (this.bR > this.bP) {
                            this.bT -= 65536;
                        }
                        if (this.bS < this.bQ) {
                            this.bU += 65536;
                        }
                        if (this.bS > this.bQ) {
                            this.bU -= 65536;
                        }
                    }
                    this.bR = this.bT >> 16;
                    this.bS = this.bU >> 16;
                    this.cc = this.bR;
                    this.cd = this.bS;
                    this.bO = (this.bR - this.bP) * (this.bR - this.bP) + (this.bS - this.bQ) * (this.bS - this.bQ);
                    if (this.bO <= this.bX) {
                        if (!this.p) {
                            this.p = true;
                        } else if (this.bP == this.bR && this.bQ == this.bS) {
                            --this.bN;
                            this.cc = this.bP;
                            this.cd = this.bQ;
                            if (this.bN <= 0) {
                                this.W = this.y ? 5 : 1;
                                com.mnemonicstudios.novusapp.n.a.aR = 64;
                                com.mnemonicstudios.novusapp.n.a.b(60);
                                this.n = false;
                            }
                        }
                    }
                } else if (this.o) {
                    if (this.bN > 0) {
                        --this.bN;
                    } else {
                        if (!this.p) {
                            if (this.bR < this.bP) {
                                this.bY += this.bV >> 3;
                                if (this.bY > this.bV) {
                                    this.bY = this.bV;
                                }
                            }
                            if (this.bR > this.bP) {
                                this.bY -= this.bV >> 3;
                                if (this.bY < -this.bV) {
                                    this.bY = -this.bV;
                                }
                            }
                            if (this.bS < this.bQ) {
                                this.bZ += this.bW >> 3;
                                if (this.bZ > this.bW) {
                                    this.bZ = this.bW;
                                }
                            }
                            if (this.bS > this.bQ) {
                                this.bZ -= this.bW >> 3;
                                if (this.bZ < -this.bW) {
                                    this.bZ = -this.bW;
                                }
                            }
                            this.bT += this.bY;
                            this.bU += this.bZ;
                        } else if (Math.abs(this.bR - this.bP) > 8 && Math.abs(this.bS - this.bQ) > 8) {
                            if (this.bR < this.bP) {
                                this.bT += 196608;
                            }
                            if (this.bR > this.bP) {
                                this.bT -= 196608;
                            }
                            if (this.bS < this.bQ) {
                                this.bU += 196608;
                            }
                            if (this.bS > this.bQ) {
                                this.bU -= 196608;
                            }
                        } else {
                            if (this.bR < this.bP) {
                                this.bT += 65536;
                            }
                            if (this.bR > this.bP) {
                                this.bT -= 65536;
                            }
                            if (this.bS < this.bQ) {
                                this.bU += 65536;
                            }
                            if (this.bS > this.bQ) {
                                this.bU -= 65536;
                            }
                        }
                        this.bR = this.bT >> 16;
                        this.bS = this.bU >> 16;
                        this.cc = this.bR;
                        this.cd = this.bS;
                        this.bO = (this.bR - this.bP) * (this.bR - this.bP) + (this.bS - this.bQ) * (this.bS - this.bQ);
                        if (this.bO <= this.bX) {
                            if (!this.p) {
                                this.p = true;
                            } else if (this.bP == this.bR && this.bQ == this.bS) {
                                this.W = this.y ? 5 : 1;
                                this.o = false;
                                com.mnemonicstudios.novusapp.n.a.aR = 64;
                                com.mnemonicstudios.novusapp.n.a.b(60);
                                this.n = false;
                                this.o = false;
                            }
                        }
                    }
                }
                com.mnemonicstudios.novusapp.n.a.d();
                break;
            }
            case 1: {
                com.mnemonicstudios.novusapp.g.o = 2;
                if (com.mnemonicstudios.novusapp.n.n) {
                    if (com.mnemonicstudios.novusapp.g.ar == 0) {
                        this.c = true;
                        com.mnemonicstudios.novusapp.g.o = 2;
                    }
                } else if (this.c && com.mnemonicstudios.novusapp.g.ar == 0) {
                    this.W = 0;
                    com.mnemonicstudios.novusapp.g.o = 2;
                    this.c = false;
                }
                q = false;
                a = System.currentTimeMillis() + 5000L;
                com.mnemonicstudios.novusapp.r.a = true;
                this.cc = com.mnemonicstudios.novusapp.n.a.f() - (a >> 1);
                this.cd = com.mnemonicstudios.novusapp.n.a.g() - (b >> 1);
                com.mnemonicstudios.novusapp.n.a.d();
                com.mnemonicstudios.novusapp.n.a.f();
                if (com.mnemonicstudios.novusapp.n.a.e() >= 0) break;
                com.mnemonicstudios.novusapp.n.a.d(0, 0);
                break;
            }
            case 2: {
                if ((this.t || this.u || this.s || this.r || this.v || this.w || this.x) && !q && com.mnemonicstudios.novusapp.n.a.a()) {
                    q = true;
                }
                if (q) {
                    com.mnemonicstudios.novusapp.r.a = true;
                    if (a < System.currentTimeMillis()) {
                        a = 0L;
                        this.t = false;
                        this.u = false;
                        this.s = false;
                        this.r = false;
                        this.v = false;
                        com.mnemonicstudios.novusapp.r.a = false;
                    }
                } else {
                    this.t = false;
                    this.u = false;
                    this.s = false;
                    this.r = false;
                    this.v = false;
                    com.mnemonicstudios.novusapp.r.a = false;
                }
                this.cc = com.mnemonicstudios.novusapp.n.a.a() - (a >> 1);
                this.cd = com.mnemonicstudios.novusapp.n.a.b() - (b >> 1);
                com.mnemonicstudios.novusapp.n.a.c();
                com.mnemonicstudios.novusapp.n.a.d();
                break;
            }
            case 5: {
                com.mnemonicstudios.novusapp.r.a = false;
                this.cc = com.mnemonicstudios.novusapp.n.a.a() - (a >> 1);
                this.cd = com.mnemonicstudios.novusapp.n.a.b() - (b >> 1);
                com.mnemonicstudios.novusapp.n.a.d();
                break;
            }
            case 4: {
                com.mnemonicstudios.novusapp.r.a = false;
                if (!this.i) {
                    try {
                        this.cc = com.mnemonicstudios.novusapp.n.a.b(this.bD, this.bE) - (a >> 1);
                        this.cd = com.mnemonicstudios.novusapp.n.a.c(this.bD, this.bE) - (b >> 1);
                    }
                    catch (Exception exception) {}
                } else if (this.l) {
                    try {
                        this.cc = com.mnemonicstudios.novusapp.n.a.b(this.bD, this.bE) - (a >> 1);
                        this.cd = com.mnemonicstudios.novusapp.n.a.c(this.bD, this.bE) - (b >> 1);
                    }
                    catch (Exception exception) {}
                }
                com.mnemonicstudios.novusapp.n.a.d();
                if (!com.mnemonicstudios.novusapp.n.c()) break;
                com.mnemonicstudios.novusapp.n.a.b(this.l);
            }
        }
        com.mnemonicstudios.novusapp.n.a.a(128);
        com.mnemonicstudios.novusapp.n.a.b();
        this.k();
        com.mnemonicstudios.novusapp.n.a.e();
        this.s();
        com.mnemonicstudios.novusapp.n.a.b();
    }

    /*
     * Unable to fully structure code
     */
    public final void c(Graphics var1_1) {
        try {
            com.mnemonicstudios.novusapp.n.a.a(this.cc + (com.mnemonicstudios.novusapp.j.a >> 1), this.cd + (com.mnemonicstudios.novusapp.j.b >> 1));
            this.e(var1_1);
            this.f(var1_1);
            this.b(var1_1);
            try {
                com.mnemonicstudios.novusapp.n.a.c();
            }
            catch (Exception v0) {}
            switch (this.W) {
                case 2: {
                    com.mnemonicstudios.novusapp.n.a.d();
                }
                case 0: {
                    if (this.W != 0) ** GOTO lbl42
                    if (com.mnemonicstudios.novusapp.g.o != 13) ** GOTO lbl28
                    try {
                        if ((com.mnemonicstudios.novusapp.j.a[1][com.mnemonicstudios.novusapp.n.a.a() >> 5][com.mnemonicstudios.novusapp.n.a.b() >> 5] >> 8 & 15) != 0) ** GOTO lbl23
                        if (com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a.a(), com.mnemonicstudios.novusapp.n.a.b(), 9216)) {
                            com.mnemonicstudios.novusapp.n.a.a(16, 8, 65280);
                        } else {
                            com.mnemonicstudios.novusapp.n.a.a(16, 8, 0xFF0000);
                        }
                        ** GOTO lbl42
lbl23:
                        // 1 sources

                        com.mnemonicstudios.novusapp.n.a.a(16, 8, 0xFF0000);
                    }
                    catch (Exception v1) {
                        com.mnemonicstudios.novusapp.n.a.a(16, 8, 0xFF0000);
                    }
                    ** GOTO lbl42
lbl28:
                    // 1 sources

                    if (!com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a.a(), com.mnemonicstudios.novusapp.n.a.b())) {
                        if (com.mnemonicstudios.novusapp.g.o == 5 || com.mnemonicstudios.novusapp.g.o == 11) {
                            this.ch = com.mnemonicstudios.novusapp.n.a.b();
                            while (!com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a.a(), this.ch) && this.ch >= 0) {
                                --this.ch;
                            }
                            if (this.ch < 1) {
                                com.mnemonicstudios.novusapp.n.a.a(16, 8, 65280);
                            } else {
                                com.mnemonicstudios.novusapp.n.a.a(16, 8, 0xFF0000);
                            }
                        } else {
                            com.mnemonicstudios.novusapp.n.a.a(16, 8, 65280);
                        }
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(16, 8, 0xFF0000);
                    }
                }
lbl42:
                // 10 sources

                case 1: 
                case 3: 
                case 5: {
                    com.mnemonicstudios.novusapp.n.a.k();
                    break;
                }
                case 4: {
                    com.mnemonicstudios.novusapp.n.a.k();
                }
            }
            this.j();
            com.mnemonicstudios.novusapp.n.a.a(var1_1, com.mnemonicstudios.novusapp.n.a, 128, 0);
            this.g(var1_1);
            switch (com.mnemonicstudios.novusapp.j.c) {
                case 0: {
                    if (this.cd + com.mnemonicstudios.novusapp.j.b > com.mnemonicstudios.novusapp.j.cf - 16) {
                        var1_1.setColor(50, 137, 251);
                        var1_1.fillRect(0, com.mnemonicstudios.novusapp.j.b - (this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf), com.mnemonicstudios.novusapp.j.a, this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf);
                        for (com.mnemonicstudios.novusapp.j.cg = 0; com.mnemonicstudios.novusapp.j.cg < (com.mnemonicstudios.novusapp.j.a >> 6) + 2; ++com.mnemonicstudios.novusapp.j.cg) {
                            var1_1.drawImage(this.f, -(this.cc & 63) + 64 * com.mnemonicstudios.novusapp.j.cg, com.mnemonicstudios.novusapp.j.b - (this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf) - 16, 20);
                        }
                    }
                    this.a(var1_1);
                    break;
                }
                case 2: {
                    if (this.cd + com.mnemonicstudios.novusapp.j.b > com.mnemonicstudios.novusapp.j.cf - 16) {
                        var1_1.setColor(50, 137, 251);
                        var1_1.fillRect(0, 0, this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf, 320);
                        for (com.mnemonicstudios.novusapp.j.cg = 0; com.mnemonicstudios.novusapp.j.cg < (com.mnemonicstudios.novusapp.j.a >> 6) + 2; ++com.mnemonicstudios.novusapp.j.cg) {
                            this.b.setTransform(7);
                            this.b.setPosition(this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf, -(this.cc & 63) + 64 * com.mnemonicstudios.novusapp.j.cg);
                            this.b.paint(var1_1);
                        }
                    }
                    this.i(var1_1);
                    break;
                }
                case 1: {
                    if (this.cd + com.mnemonicstudios.novusapp.j.b > com.mnemonicstudios.novusapp.j.cf - 16) {
                        var1_1.setColor(50, 137, 251);
                        var1_1.fillRect(com.mnemonicstudios.novusapp.j.b - (this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf), 0, this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf, 320);
                        for (com.mnemonicstudios.novusapp.j.cg = 0; com.mnemonicstudios.novusapp.j.cg < (com.mnemonicstudios.novusapp.j.a >> 6) + 2; ++com.mnemonicstudios.novusapp.j.cg) {
                            this.b.setTransform(4);
                            this.b.setPosition(com.mnemonicstudios.novusapp.j.b - (this.cd + com.mnemonicstudios.novusapp.j.b - com.mnemonicstudios.novusapp.j.cf) - 16, -(this.cc & 63) + 64 * com.mnemonicstudios.novusapp.j.cg);
                            this.b.paint(var1_1);
                        }
                    }
                    this.h(var1_1);
                }
            }
            if (this.W == 4) {
                try {
                    if (this.l && !com.mnemonicstudios.novusapp.n.a.a()) {
                        com.mnemonicstudios.novusapp.n.a.b(var1_1, 50, com.mnemonicstudios.novusapp.j.a >> 1, com.mnemonicstudios.novusapp.j.b >> 2, 17, com.mnemonicstudios.novusapp.n.H);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.b(var1_1, 42, com.mnemonicstudios.novusapp.j.a >> 1, com.mnemonicstudios.novusapp.j.b >> 2, 17, com.mnemonicstudios.novusapp.n.H);
                    }
                    if (this.i && !this.l) {
                        com.mnemonicstudios.novusapp.n.a.b(var1_1, 48, com.mnemonicstudios.novusapp.j.a >> 1, com.mnemonicstudios.novusapp.j.b >> 1, 17, com.mnemonicstudios.novusapp.n.H);
                    }
                }
                catch (Exception v2) {}
                switch (com.mnemonicstudios.novusapp.j.c) {
                    case 0: {
                        if (com.mnemonicstudios.novusapp.n.a) {
                            com.mnemonicstudios.novusapp.n.a.b(var1_1, 104, 2, com.mnemonicstudios.novusapp.j.b, 36, com.mnemonicstudios.novusapp.n.F);
                            break;
                        }
                        com.mnemonicstudios.novusapp.n.a.b(var1_1, 104, com.mnemonicstudios.novusapp.j.a - 2, com.mnemonicstudios.novusapp.j.b, 40, com.mnemonicstudios.novusapp.n.F);
                        break;
                    }
                    case 1: 
                    case 2: {
                        if (com.mnemonicstudios.novusapp.n.a) {
                            com.mnemonicstudios.novusapp.n.a.b(var1_1, 104, com.mnemonicstudios.novusapp.j.a - 2, com.mnemonicstudios.novusapp.j.b - 2, 40, com.mnemonicstudios.novusapp.n.F);
                            break;
                        }
                        com.mnemonicstudios.novusapp.n.a.b(var1_1, 104, com.mnemonicstudios.novusapp.j.a - 2, 32, 40, com.mnemonicstudios.novusapp.n.F);
                    }
                }
            }
            com.mnemonicstudios.novusapp.n.a.c(var1_1);
            return;
        }
        catch (Exception v3) {
            return;
        }
    }

    public final void d(Graphics graphics) {
        if (this.cd + b > cf - 16) {
            graphics.setColor(50, 137, 251);
            graphics.fillRect(0, b - (this.cd + b - cf), a, this.cd + b - cf);
            for (cg = 0; cg < (a >> 6) + 2; ++cg) {
                graphics.drawImage(this.f, -(this.cc & 0x3F) + 64 * cg, b - (this.cd + b - cf) - 16, 20);
            }
        }
    }

    public final void l(int n2, int n3, int n4) {
        if (!com.mnemonicstudios.novusapp.n.a.a(n2, n3)) {
            this.ci = com.mnemonicstudios.novusapp.i.a(n2 - com.mnemonicstudios.novusapp.n.a.a(), n3 - com.mnemonicstudios.novusapp.n.a.b());
            if (n3 > 640) {
                this.W = 1;
            }
        }
    }

    public final void o() {
        if (!this.y) {
            if (com.mnemonicstudios.novusapp.n.a.a(1)) {
                this.y = true;
                com.mnemonicstudios.novusapp.n.a.j(com.mnemonicstudios.novusapp.n.a.a(), com.mnemonicstudios.novusapp.n.a.b() + 128, 1);
                return;
            }
            com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
        }
    }

    public final void p() {
        if (this.y) {
            this.y = false;
            this.W = 1;
            com.mnemonicstudios.novusapp.n.a.Q = 16;
            com.mnemonicstudios.novusapp.n.a.k(com.mnemonicstudios.novusapp.n.a.f(), com.mnemonicstudios.novusapp.n.a.g(), 16);
        }
    }

    public final void a(Graphics graphics, int n2) {
        graphics.drawImage(this.b, n2, 0, 20);
    }

    public final void e(Graphics graphics) {
        try {
            this.ca = (this.b.getWidth() - a << 6) * com.mnemonicstudios.novusapp.n.a.c() >> 16;
            this.ca -= 4;
            if (this.ca < 0) {
                this.ca = 0;
            }
            switch (c) {
                case 0: {
                    this.a.setTransform(0);
                    this.a.setPosition(-this.ca, 0);
                    this.a.paint(graphics);
                    break;
                }
                case 2: {
                    this.a.setTransform(7);
                    this.a.setPosition(240 - this.b.getHeight(), 0);
                    this.a.paint(graphics);
                    this.a.setPosition(240 - this.b.getHeight(), this.b.getWidth());
                    this.a.paint(graphics);
                    break;
                }
                case 1: {
                    this.a.setTransform(4);
                    this.a.setPosition(0, -this.ca);
                    this.a.paint(graphics);
                    this.a.setPosition(0, -this.ca + this.b.getWidth());
                    this.a.paint(graphics);
                }
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final void q() {
        for (cm = 0; cm < 1024; ++cm) {
            com.mnemonicstudios.novusapp.j.i[com.mnemonicstudios.novusapp.j.cm] = com.mnemonicstudios.novusapp.j.b(co);
            com.mnemonicstudios.novusapp.j.j[com.mnemonicstudios.novusapp.j.cm] = com.mnemonicstudios.novusapp.j.a(co);
            com.mnemonicstudios.novusapp.j.i[2047 - com.mnemonicstudios.novusapp.j.cm] = -i[cm];
            com.mnemonicstudios.novusapp.j.j[2047 - com.mnemonicstudios.novusapp.j.cm] = j[cm];
            com.mnemonicstudios.novusapp.j.i[2048 + com.mnemonicstudios.novusapp.j.cm] = -i[cm];
            com.mnemonicstudios.novusapp.j.j[2048 + com.mnemonicstudios.novusapp.j.cm] = -j[cm];
            com.mnemonicstudios.novusapp.j.i[4095 - com.mnemonicstudios.novusapp.j.cm] = i[cm];
            com.mnemonicstudios.novusapp.j.j[4095 - com.mnemonicstudios.novusapp.j.cm] = -j[cm];
            co += cn;
        }
    }

    private static int a(long l2) {
        d = 3L;
        c = -1L;
        e = l2;
        for (cq = 0; cq < cp; ++cq) {
            e += c * (com.mnemonicstudios.novusapp.j.a(l2, d) / com.mnemonicstudios.novusapp.j.a(d));
            d += 2L;
            c *= -1L;
        }
        return (int)(e >> 8);
    }

    private static int b(long l2) {
        d = 2L;
        c = -1L;
        e = 0xFFFFFFL;
        for (cq = 0; cq < cp; ++cq) {
            e += c * (com.mnemonicstudios.novusapp.j.a(l2, d) / com.mnemonicstudios.novusapp.j.a(d));
            d += 2L;
            c *= -1L;
        }
        return (int)(e >> 8);
    }

    private static long a(long l2) {
        f = l2;
        g = 1L;
        cr = 0;
        while ((long)cr < l2) {
            g *= f;
            --f;
            ++cr;
        }
        return g;
    }

    private static long a(long l2, long l3) {
        g = l2;
        if (l3 > 1L) {
            cr = 1;
            while ((long)cr < l3) {
                g = g * l2 >> 24;
                ++cr;
            }
        }
        return g;
    }

    public final void c(int n2) {
        if (com.mnemonicstudios.novusapp.n.a(100) > 50) {
            if (com.mnemonicstudios.novusapp.n.a(100) > 75) {
                this.e[n2][1] = com.mnemonicstudios.novusapp.n.a.d() - 16 << 16;
                this.e[n2][0] = com.mnemonicstudios.novusapp.n.a.c() + (com.mnemonicstudios.novusapp.n.a(a + 32) - 16) << 16;
            } else {
                this.e[n2][1] = com.mnemonicstudios.novusapp.n.a.d() + b + 16 << 16;
                this.e[n2][0] = com.mnemonicstudios.novusapp.n.a.c() + (com.mnemonicstudios.novusapp.n.a(a + 32) - 16) << 16;
            }
        } else {
            this.e[n2][0] = com.mnemonicstudios.novusapp.n.a(100) > 50 ? com.mnemonicstudios.novusapp.n.a.a() + (a >> 1) + 16 << 16 : com.mnemonicstudios.novusapp.n.a.a() - (a >> 1) - 16 << 16;
            this.e[n2][1] = com.mnemonicstudios.novusapp.n.a.d() + com.mnemonicstudios.novusapp.n.a(b) << 16;
        }
        this.e[n2][6] = 2;
        this.e[n2][7] = com.mnemonicstudios.novusapp.n.a(16);
        this.e[n2][2] = com.mnemonicstudios.novusapp.n.a.a() * k[n2 >> 2] >> 4;
        this.e[n2][3] = (3 + com.mnemonicstudios.novusapp.n.a(3)) * k[n2 >> 2] >> 1;
    }

    public final void r() {
        this.cs = 0;
        while (this.cs < this.e.length) {
            this.c(this.cs);
            ++this.cs;
        }
    }

    public final void s() {
        this.cs = 0;
        while (this.cs < this.e.length) {
            int[] nArray = this.e[this.cs];
            nArray[6] = nArray[6] - 1;
            this.e[this.cs][2] = com.mnemonicstudios.novusapp.n.a.a() * k[this.cs >> 2] >> 4;
            if (this.e[this.cs][6] < 0) {
                if (!com.mnemonicstudios.novusapp.n.a.a(this.e[this.cs][0] >> 16, this.e[this.cs][1] >> 16, 16)) {
                    this.c(this.cs);
                }
                this.e[this.cs][6] = 8 + com.mnemonicstudios.novusapp.n.a(8);
            }
            int[] nArray2 = this.e[this.cs];
            nArray2[0] = nArray2[0] + this.e[this.cs][2];
            int[] nArray3 = this.e[this.cs];
            nArray3[1] = nArray3[1] + this.e[this.cs][3];
            ++this.cs;
        }
    }

    public final void f(Graphics graphics) {
        try {
            graphics.setClip(0, 0, 240, 320);
            this.cs = 0;
            while (this.cs < this.e.length >> 1) {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a[bL][this.cs >> 2], this.e[this.cs][0] >> 16, this.e[this.cs][1] >> 16, this.e[this.cs][7] >> 2, 0);
                this.e[this.cs][7] = this.e[this.cs][7] + 1 & 0xF;
                ++this.cs;
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public final void g(Graphics graphics) {
        try {
            graphics.setClip(0, 0, 240, 320);
            this.cs = this.e.length >> 1;
            while (this.cs < this.e.length) {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a[bL][this.cs >> 2], this.e[this.cs][0] >> 16, this.e[this.cs][1] >> 16, this.e[this.cs][7] >> 2, 0);
                this.e[this.cs][7] = this.e[this.cs][7] + 1 & 0xF;
                ++this.cs;
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    static {
        f = false;
        g = false;
        h = false;
        f = new int[1024];
        c = new int[44][1024];
        g = new int[1024];
        h = new int[1024];
        d = new int[44][3];
        aY = 0;
        bx = 32;
        by = 16;
        m = false;
        bK = 0;
        bL = 0;
        bM = 0;
        q = false;
        a = 0L;
        cf = 499;
        i = new int[4096];
        j = new int[4096];
        cn = 25735;
        co = 0;
        cp = 5;
        cr = 0;
        f = 0L;
        g = 0L;
        k = new int[]{21845, 43691, 87381, 109227};
        int[] nArray = new int[]{2, 4, 6, 8};
    }
}


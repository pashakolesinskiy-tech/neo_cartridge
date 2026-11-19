/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 *  javax.microedition.lcdui.game.Sprite
 *  javax.microedition.rms.RecordStore
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.NovusMidlet;
import com.mnemonicstudios.novusapp.d;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;
import com.mnemonicstudios.novusapp.p;
import com.mnemonicstudios.novusapp.q;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;
import javax.microedition.rms.RecordStore;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class o {
    public static boolean a = false;
    public static boolean b;
    private int R;
    private int S;
    private int T;
    private int U;
    private int V;
    private boolean n;
    private int[][] a;
    private int W = 0;
    private int X = 40;
    private int Y;
    private int[] d;
    private int[] e;
    private int Z;
    private boolean o;
    private int aa;
    private int ab;
    private int ac;
    private int ad;
    private Sprite b;
    private Sprite c;
    private Sprite d;
    private Sprite e;
    private Sprite f;
    private Sprite g;
    private Sprite h;
    private Sprite i;
    private Sprite j;
    private Sprite k;
    public static Sprite a;
    private Sprite l;
    private int ae = -12800;
    private int af;
    private int ag;
    private int ah;
    private int ai = 0;
    private long b;
    private long c;
    private final int[][] b;
    public static int a;
    private int aj = 0;
    boolean c;
    public boolean d;
    private int ak;
    boolean e;
    int b;
    int c;
    int d = false;
    int e;
    int f;
    int g;
    int h;
    int i;
    private int al;
    int[] a;
    int j;
    int k;
    int l;
    int m;
    int n;
    int o;
    private static int am;
    public static int[] b;
    private int[][][] a;
    int p;
    int q;
    int r;
    int s;
    int t;
    int u;
    int v;
    int w = 0;
    long a = new int[][]{null, {26, 27, 111}, {26, 27}, {28, 29, 33, 30}, {38, 39, 40, 41}, {-1}, {107}, {125, 126, 127, 128}, {35, 24, 22, 36}, {35, 37, 24, 22, 36}, {104, 105}, {-1}, {-1}, {-1}, {6}, {-1}, {-1}, {-1}, {-1}, {-1}, {-1}, {-1}, {-1}, {-1}, {104}, {-1}, {-1}, {-1}};
    int x;
    int y;
    int z;
    boolean f = false;
    boolean g = false;
    boolean h = false;
    boolean i = false;
    boolean j = false;
    int A;
    int B;
    int C;
    int D;
    int E;
    int F;
    int G;
    int H;
    int I;
    int J;
    int K;
    int L;
    int M;
    boolean k = true;
    int N;
    int O;
    int[] c = true;
    int P;
    public static int Q;
    private static int an;
    private static int ao;
    private static boolean p;
    private static int ap;
    private int aq;
    public static boolean l;
    public static boolean m;
    private static byte[] a;
    private static int ar;
    private static RecordStore a;
    private static byte a;
    private static int as;
    private static int at;
    private static int au;
    private static int av;

    public o() {
        this.d = new int[10];
        this.e = new int[10];
        this.b = new int[][]{{27, 16, 32, 18}, {27, 11, 35, 14}, {25, 15, 33, 18}, {25, 18, 32, 21}, {29, 11, 38, 15}};
        this.a = new int[][][]{new int[][]{{0, 2, 1, 0, 0}, {1, 2}}, new int[][]{{3, 0, 2, 1920, -512}, {3, 4}}, new int[][]{{1, 0, 3, 1920, 512}, {4, 5}}, new int[][]{{1, 2, 4, 3840, -1024}, {6}}, new int[][]{{0, 0, 5, 3840, 0}, {6, 7}}, new int[][]{{2, 0, 6, 3840, 1024}, {7}}, new int[][]{{3, 2, 7, 5760, -512}, {8, 9}}, new int[][]{{2, 0, 8, 5760, 512}, {9, 10}}, new int[][]{{0, 2, 9, 7680, -1024}, {11}}, new int[][]{{3, 0, 10, 7680, 0}, {11}}, new int[][]{{1, 0, 11, 7680, 1024}, {11}}, new int[][]{{4, 0, 12, 9600, 0}, {-1}}};
        this.c = new int[]{0, -1, 1, -2, 2, -3, 3};
        try {
            this.b = new Sprite(Image.createImage((String)"/menu_softkeyicons.png"), 18, 18);
            this.c = new Sprite(Image.createImage((String)"/menu_spaceworm.png"));
            this.d = new Sprite(Image.createImage((String)"/menu_wormeye.png"));
            this.l = new Sprite(Image.createImage((String)"/speaker.png"));
            this.e = new Sprite(Image.createImage((String)"/menu_planets.png"), 38, 38);
            this.e.defineReferencePixel(this.e.getWidth() >> 1, this.e.getHeight() >> 1);
            this.f = new Sprite(Image.createImage((String)"/menu_moon.png"), 12, 12);
            this.g = new Sprite(Image.createImage((String)"/menu_boom.png"), 8, 8);
            this.h = new Sprite(Image.createImage((String)"/menu_nuke.png"), 21, 21);
            this.i = new Sprite(Image.createImage((String)"/menu_ring.png"), 31, 15);
            this.k = new Sprite(Image.createImage((String)"/menu_ufo.png"), 20, 16);
            a = new Sprite(Image.createImage((String)"/menu_arrow.png"), 12, 16);
            this.j = new Sprite(Image.createImage((String)"/worms_flags.png"), 48, 32);
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void h() {
        if (this.a[0] == null) {
            try {
                b = NovusMidlet.a.getAppProperty("GameLinkEnabled").equals("true");
            }
            catch (Exception exception) {
                b = false;
            }
            this.a[0] = b ? new int[]{20, 21, 22, 23, 24, 142, 25} : new int[]{20, 21, 22, 23, 24, 25};
        }
        this.R = NovusMidlet.a.getWidth();
        this.S = NovusMidlet.a.getHeight();
        this.T = 0;
        this.U = 0;
        this.V = com.mnemonicstudios.novusapp.j.c;
        this.Z = 80;
        this.X = this.W + this.S - this.a[0].length * 24 >> 1;
        if (com.mnemonicstudios.novusapp.o.b()) {
            return;
        }
        com.mnemonicstudios.novusapp.o.j();
    }

    public final boolean a() {
        if (this.c) {
            this.h();
            this.c = false;
        }
        switch (this.aj) {
            case 0: {
                if (com.mnemonicstudios.novusapp.n.k) {
                    com.mnemonicstudios.novusapp.n.k = false;
                    if (--a < 0) {
                        a = 4;
                    }
                } else if (com.mnemonicstudios.novusapp.n.l) {
                    com.mnemonicstudios.novusapp.n.l = false;
                    if (++a > 4) {
                        a = 0;
                    }
                }
                if (!com.mnemonicstudios.novusapp.n.m && !com.mnemonicstudios.novusapp.n.c()) break;
                this.aj = 1;
                break;
            }
            case 1: {
                if (com.mnemonicstudios.novusapp.n.c()) {
                    l = true;
                    m = true;
                    return true;
                }
                if (!com.mnemonicstudios.novusapp.n.d()) break;
                l = false;
                m = false;
                return true;
            }
        }
        return false;
    }

    public final void a(Graphics graphics) {
        try {
            graphics.setColor(0);
            graphics.fillRect(0, 0, this.R, this.S);
            switch (this.aj) {
                case 0: {
                    for (int i2 = 0; i2 < 5; ++i2) {
                        if (i2 == a) {
                            graphics.setColor(0xBBBBFF);
                        } else {
                            graphics.setColor(0x444466);
                        }
                        this.j.setFrame(i2);
                        graphics.fillRect((this.R >> 1) - 28, 48 + i2 * 48 - 4, 56, 40);
                        this.j.setPosition((this.R >> 1) - (this.j.getWidth() >> 1), 48 + i2 * 48);
                        this.j.paint(graphics);
                    }
                    this.a(graphics, -1, 0);
                    break;
                }
                case 1: {
                    this.l.setPosition((this.R >> 1) - (this.l.getWidth() >> 1), (this.S >> 1) - (this.l.getHeight() >> 1));
                    this.l.paint(graphics);
                    this.a(graphics, 1, 0);
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

    public final void a(boolean bl) {
        com.mnemonicstudios.novusapp.n.a.a();
        this.ak = com.mnemonicstudios.novusapp.n.b;
        com.mnemonicstudios.novusapp.n.b = 1;
        com.mnemonicstudios.novusapp.n.a.a(0);
        this.T = bl && this.n ? 9 : 8;
        this.U = 0;
        this.ad = 0;
        while (this.ad < this.a[this.T].length) {
            this.e[this.ad] = 0;
            this.d[this.ad] = 0;
            ++this.ad;
        }
        this.X = this.W + this.S - this.a[this.T].length * 24 >> 1;
        this.o = false;
        if (com.mnemonicstudios.novusapp.n.h) {
            this.c = this.T;
            this.b(24);
            com.mnemonicstudios.novusapp.n.h = false;
            return;
        }
        com.mnemonicstudios.novusapp.n.c();
    }

    public final void b(boolean bl) {
        com.mnemonicstudios.novusapp.n.a.a();
        com.mnemonicstudios.novusapp.n.b = 1;
        com.mnemonicstudios.novusapp.n.a.a(0);
        if (bl && this.n) {
            this.T = 11;
            this.d();
            com.mnemonicstudios.novusapp.o.f();
        } else {
            this.T = 0;
        }
        this.U = 0;
        this.ad = 0;
        while (this.ad < this.a[this.T].length) {
            this.e[this.ad] = 0;
            this.d[this.ad] = 0;
            ++this.ad;
        }
        this.X = this.W + this.S - this.a[this.T].length * 24 >> 1;
        this.o = false;
        com.mnemonicstudios.novusapp.n.c();
    }

    public final void c(boolean bl) {
        com.mnemonicstudios.novusapp.n.a.a();
        this.ak = com.mnemonicstudios.novusapp.n.b;
        com.mnemonicstudios.novusapp.n.b = 1;
        com.mnemonicstudios.novusapp.n.a.a(0);
        if (bl) {
            this.T = 11;
            com.mnemonicstudios.novusapp.o.f();
        } else {
            this.T = 7;
        }
        this.U = 0;
        this.ad = 0;
        while (this.ad < this.a[this.T].length) {
            this.e[this.ad] = 0;
            this.d[this.ad] = 0;
            ++this.ad;
        }
        this.X = this.W + this.S - this.a[this.T].length * 24 >> 1;
        this.o = false;
        com.mnemonicstudios.novusapp.n.c();
    }

    public final void a() {
        this.e = 2;
        this.f = 56;
        this.g = 236;
        this.h = 320 - this.f;
        this.i = 40;
        try {
            com.mnemonicstudios.novusapp.n.a = NovusMidlet.a.getAppProperty("Game-Link");
            return;
        }
        catch (Exception exception) {
            com.mnemonicstudios.novusapp.n.a = null;
            return;
        }
    }

    public final void d(boolean bl) {
        if (com.mnemonicstudios.novusapp.n.d) {
            if (com.mnemonicstudios.novusapp.n.c()) {
                if (com.mnemonicstudios.novusapp.n.a != null) {
                    try {
                        NovusMidlet.a.platformRequest(com.mnemonicstudios.novusapp.n.a);
                    }
                    catch (Exception exception) {}
                    com.mnemonicstudios.novusapp.n.e = false;
                    return;
                }
            } else if (com.mnemonicstudios.novusapp.n.d()) {
                com.mnemonicstudios.novusapp.n.d = false;
                return;
            }
        } else if (bl) {
            if (com.mnemonicstudios.novusapp.n.b()) {
                com.mnemonicstudios.novusapp.n.a = System.currentTimeMillis();
                com.mnemonicstudios.novusapp.n.c = true;
                return;
            }
            if (com.mnemonicstudios.novusapp.n.a() && com.mnemonicstudios.novusapp.n.a != null) {
                com.mnemonicstudios.novusapp.p.a(this.e, this.f, this.g, this.h);
                com.mnemonicstudios.novusapp.p.a(143, 0);
                com.mnemonicstudios.novusapp.n.d = true;
                return;
            }
        } else {
            if (com.mnemonicstudios.novusapp.n.b()) {
                com.mnemonicstudios.novusapp.n.e = false;
                return;
            }
            if (com.mnemonicstudios.novusapp.n.a() && com.mnemonicstudios.novusapp.n.a != null) {
                com.mnemonicstudios.novusapp.p.a(this.e, this.f, this.g, this.h);
                com.mnemonicstudios.novusapp.p.a(143, 0);
                com.mnemonicstudios.novusapp.n.d = true;
            }
        }
    }

    public final void a(Graphics graphics, boolean bl) {
        if (!bl) {
            com.mnemonicstudios.novusapp.n.a.a(0);
            this.c(graphics);
            this.d(graphics);
        }
        if (com.mnemonicstudios.novusapp.n.d) {
            com.mnemonicstudios.novusapp.p.a(graphics);
            this.a(graphics, 2, 0);
            return;
        }
        com.mnemonicstudios.novusapp.n.a.b(graphics, 152, 120, 160, 17, com.mnemonicstudios.novusapp.n.F);
        if (com.mnemonicstudios.novusapp.n.a != null) {
            com.mnemonicstudios.novusapp.n.a.b(graphics, 153, 2, 318, 36, com.mnemonicstudios.novusapp.n.H);
        }
        if (bl) {
            com.mnemonicstudios.novusapp.n.a.b(graphics, 154, 120, 160 + this.i, 17, com.mnemonicstudios.novusapp.n.F);
            com.mnemonicstudios.novusapp.n.a.b(graphics, 156, 238, 318, 40, com.mnemonicstudios.novusapp.n.H);
            return;
        }
        com.mnemonicstudios.novusapp.n.a.b(graphics, 155, 120, 160 + this.i, 17, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.b(graphics, 157, 238, 318, 40, com.mnemonicstudios.novusapp.n.H);
    }

    public final void b() {
        if (this.d) {
            this.d = false;
        }
        if (com.mnemonicstudios.novusapp.n.h && this.T != 24 && !this.o) {
            this.c = this.T;
            this.b(24);
            com.mnemonicstudios.novusapp.n.h = false;
        }
        if (l && this.T != 24) {
            if (com.mnemonicstudios.novusapp.n.a.getMediaTime() == 0L) {
                if (++this.d > 50) {
                    com.mnemonicstudios.novusapp.n.c();
                }
            } else {
                this.d = 0;
            }
        }
        if (a && this.T != 24) {
            com.mnemonicstudios.novusapp.q.b();
            return;
        }
        if (com.mnemonicstudios.novusapp.n.b && !com.mnemonicstudios.novusapp.n.c && this.T != 24) {
            this.d(true);
            return;
        }
        this.i();
        if (this.o) {
            switch (this.ab) {
                case 0: {
                    boolean bl = false;
                    this.ad = 0;
                    while (this.ad < this.a[this.T].length) {
                        int n2 = this.ad;
                        this.e[n2] = this.e[n2] + this.Z * (10 - this.ad);
                        int n3 = this.ad;
                        this.d[n3] = this.d[n3] + this.e[this.ad];
                        if (this.ad == 0 && this.d[this.ad] >> 8 > this.S) {
                            bl = true;
                        }
                        ++this.ad;
                    }
                    if (bl) {
                        this.ad = 0;
                        while (this.ad < this.a[this.T].length) {
                            this.d[this.ad] = -(this.d[this.ad] + (this.ad * 5 + com.mnemonicstudios.novusapp.n.a(40) << 8));
                            ++this.ad;
                        }
                        this.T = this.aa;
                        this.U = 0;
                        this.X = this.W + this.S - this.a[this.T].length * 24 >> 1;
                        this.ab = 1;
                    }
                    return;
                }
                case 1: {
                    this.ad = 0;
                    while (this.ad < this.a[this.T].length) {
                        int n4 = this.ad;
                        this.e[n4] = this.e[n4] + this.Z * (10 - this.ad);
                        int n5 = this.ad;
                        this.d[n5] = this.d[n5] + this.e[this.ad];
                        if (this.d[this.ad] > 0) {
                            this.d[this.ad] = 0;
                            this.e[this.ad] = -(this.e[this.ad] >> 2);
                        }
                        ++this.ad;
                    }
                    boolean bl = true;
                    this.ad = 0;
                    while (this.ad < this.a[this.T].length) {
                        if (this.T == 14 || this.T == 15) {
                            if (Math.abs(this.e[this.ad]) > 256) {
                                bl = false;
                            }
                        } else if (Math.abs(this.e[this.ad]) > 128) {
                            bl = false;
                        }
                        ++this.ad;
                    }
                    if (!bl) break;
                    this.ad = 0;
                    while (this.ad < this.a[this.T].length) {
                        this.e[this.ad] = 0;
                        this.d[this.ad] = 0;
                        ++this.ad;
                    }
                    this.o = false;
                }
            }
        } else {
            switch (this.T) {
                case 25: {
                    if (com.mnemonicstudios.novusapp.n.a[com.mnemonicstudios.novusapp.n.c].a()) {
                        com.mnemonicstudios.novusapp.n.b = 3;
                        com.mnemonicstudios.novusapp.n.a.a(0);
                        break;
                    }
                    ++this.b;
                    break;
                }
                case 14: {
                    this.d = false;
                    if (this.e) {
                        if (com.mnemonicstudios.novusapp.n.a.b()) {
                            this.e = false;
                        }
                        ++this.b;
                        break;
                    }
                    com.mnemonicstudios.novusapp.n.b = 2;
                    com.mnemonicstudios.novusapp.n.a.a(this.V);
                    this.T = 0;
                    this.U = 0;
                    this.ad = 0;
                    while (this.ad < this.a[this.T].length) {
                        this.e[this.ad] = 0;
                        this.d[this.ad] = 0;
                        ++this.ad;
                    }
                    com.mnemonicstudios.novusapp.n.d();
                    break;
                }
                case 15: {
                    this.d = false;
                    if (this.e) {
                        if (com.mnemonicstudios.novusapp.n.a.a(an, true)) {
                            this.e = false;
                        }
                        ++this.b;
                        break;
                    }
                    com.mnemonicstudios.novusapp.n.a.a(an, false);
                    this.a(17);
                }
            }
        }
        if (this.T == 11) {
            this.e();
            return;
        }
        this.c();
    }

    public final void c() {
        if (this.aq > 0) {
            --this.aq;
        }
        switch (this.T) {
            case 12: {
                if (com.mnemonicstudios.novusapp.n.k) {
                    com.mnemonicstudios.novusapp.n.k = false;
                    if (--this.U < 0) {
                        this.U = b.length - 1;
                    }
                } else if (com.mnemonicstudios.novusapp.n.l) {
                    com.mnemonicstudios.novusapp.n.l = false;
                    if (++this.U >= b.length) {
                        this.U = 0;
                    }
                }
                if (com.mnemonicstudios.novusapp.n.i) {
                    com.mnemonicstudios.novusapp.n.i = false;
                    if (b[this.U] == 0) break;
                    int n2 = this.U;
                    b[n2] = b[n2] - 1;
                    break;
                }
                if (!com.mnemonicstudios.novusapp.n.j) break;
                com.mnemonicstudios.novusapp.n.j = false;
                if (b[this.U] == 2) break;
                int n3 = this.U;
                b[n3] = b[n3] + 1;
                break;
            }
            case 13: {
                if (com.mnemonicstudios.novusapp.n.i) {
                    com.mnemonicstudios.novusapp.n.i = false;
                    if (--com.mnemonicstudios.novusapp.d.b >= 0) break;
                    com.mnemonicstudios.novusapp.d.b = 4;
                    break;
                }
                if (!com.mnemonicstudios.novusapp.n.j) break;
                com.mnemonicstudios.novusapp.n.j = false;
                if (++com.mnemonicstudios.novusapp.d.b <= 4) break;
                com.mnemonicstudios.novusapp.d.b = 0;
                break;
            }
            case 5: {
                com.mnemonicstudios.novusapp.p.a();
                break;
            }
            case 20: {
                if (this.o) {
                    this.g();
                    com.mnemonicstudios.novusapp.p.a(123, 0);
                    com.mnemonicstudios.novusapp.n.a.a = -1;
                }
                com.mnemonicstudios.novusapp.p.a();
                break;
            }
            case 21: {
                break;
            }
            case 18: {
                com.mnemonicstudios.novusapp.p.a();
                break;
            }
            case 19: 
            case 23: {
                com.mnemonicstudios.novusapp.p.a();
                break;
            }
            case 22: {
                com.mnemonicstudios.novusapp.p.a();
                break;
            }
            case 26: {
                com.mnemonicstudios.novusapp.p.a();
                break;
            }
            case 27: {
                com.mnemonicstudios.novusapp.p.a();
                break;
            }
            default: {
                if (this.a[this.T][0] == -1) break;
                if (com.mnemonicstudios.novusapp.n.k) {
                    com.mnemonicstudios.novusapp.n.k = false;
                    if (--this.U >= 0) break;
                    this.U = this.a[this.T].length - 1;
                    break;
                }
                if (!com.mnemonicstudios.novusapp.n.l) break;
                com.mnemonicstudios.novusapp.n.l = false;
                if (++this.U < this.a[this.T].length) break;
                this.U = 0;
            }
        }
        if (com.mnemonicstudios.novusapp.n.c() || com.mnemonicstudios.novusapp.n.m) {
            com.mnemonicstudios.novusapp.n.m = false;
            switch (this.T) {
                case 0: {
                    switch (this.U) {
                        case 0: {
                            this.a(3);
                            break;
                        }
                        case 1: {
                            this.a(4);
                            break;
                        }
                        case 2: {
                            this.a(1);
                            break;
                        }
                        case 3: {
                            this.g();
                            com.mnemonicstudios.novusapp.p.a(131, 0);
                            com.mnemonicstudios.novusapp.n.a.a = -1;
                            this.b(5);
                            break;
                        }
                        case 4: {
                            this.g();
                            com.mnemonicstudios.novusapp.p.a(123, 0);
                            this.b(20);
                            com.mnemonicstudios.novusapp.n.a.a = -1;
                            break;
                        }
                        case 5: {
                            if (b) {
                                a = true;
                                break;
                            }
                            this.a(19);
                            break;
                        }
                        case 6: {
                            this.a(19);
                        }
                    }
                    break;
                }
                case 1: 
                case 2: {
                    switch (this.U) {
                        case 0: {
                            if (this.aq != 0) break;
                            boolean bl = l = !l;
                            if (l) {
                                com.mnemonicstudios.novusapp.n.c();
                            } else {
                                com.mnemonicstudios.novusapp.n.d();
                            }
                            this.aq = 25;
                            break;
                        }
                        case 1: {
                            m = !m;
                            break;
                        }
                        case 2: {
                            if (this.V == 0) {
                                this.V = 1;
                                this.g();
                                com.mnemonicstudios.novusapp.p.a(138, 0);
                                this.b(27);
                                break;
                            }
                            this.V = 0;
                        }
                    }
                    break;
                }
                case 3: {
                    switch (this.U) {
                        case 0: {
                            this.a(14);
                            com.mnemonicstudios.novusapp.j.bK = 2;
                            break;
                        }
                        case 1: {
                            this.N = this.a[Q][0][3] >> 4;
                            this.O = 0;
                            this.C = this.a[Q][0][3] + 256;
                            this.D = this.a[Q][0][4] + 32 - com.mnemonicstudios.novusapp.n.a(64);
                            if (Q > 0) {
                                this.a(10);
                                break;
                            }
                            this.a(11);
                            com.mnemonicstudios.novusapp.n.a.a = -1;
                            break;
                        }
                        case 2: {
                            this.a(7);
                            break;
                        }
                        case 3: {
                            this.a(12);
                        }
                    }
                    break;
                }
                case 4: {
                    switch (this.U) {
                        case 0: {
                            com.mnemonicstudios.novusapp.j.bK = 1;
                            break;
                        }
                        case 1: {
                            com.mnemonicstudios.novusapp.j.bK = 7;
                            break;
                        }
                        case 2: {
                            com.mnemonicstudios.novusapp.j.bK = 6;
                            break;
                        }
                        case 3: {
                            com.mnemonicstudios.novusapp.j.bK = 5;
                        }
                    }
                    this.a(14);
                    break;
                }
                case 5: {
                    break;
                }
                case 6: {
                    switch (this.U) {
                        case 0: {
                            this.g();
                            com.mnemonicstudios.novusapp.p.a(123, 0);
                            this.a(20);
                            break;
                        }
                        case 1: {
                            this.a(21);
                        }
                    }
                    break;
                }
                case 20: {
                    break;
                }
                case 21: {
                    break;
                }
                case 7: {
                    this.g();
                    switch (this.U) {
                        case 0: {
                            com.mnemonicstudios.novusapp.n.c = 0;
                            com.mnemonicstudios.novusapp.p.a(119, 0);
                            break;
                        }
                        case 1: {
                            com.mnemonicstudios.novusapp.n.c = 1;
                            com.mnemonicstudios.novusapp.p.a(121, 0);
                            break;
                        }
                        case 2: {
                            com.mnemonicstudios.novusapp.n.c = 2;
                            com.mnemonicstudios.novusapp.p.a(120, 0);
                            break;
                        }
                        case 3: {
                            com.mnemonicstudios.novusapp.n.c = 3;
                            com.mnemonicstudios.novusapp.p.a(122, 0);
                        }
                    }
                    this.d = false;
                    this.a(22);
                    break;
                }
                case 22: {
                    com.mnemonicstudios.novusapp.n.a[com.mnemonicstudios.novusapp.n.c].a(false);
                    if (com.mnemonicstudios.novusapp.n.c == 2) {
                        this.b(25);
                    } else {
                        com.mnemonicstudios.novusapp.n.b = 3;
                        com.mnemonicstudios.novusapp.n.a.a(0);
                    }
                    com.mnemonicstudios.novusapp.n.d();
                    break;
                }
                case 8: {
                    switch (this.U) {
                        case 0: {
                            com.mnemonicstudios.novusapp.n.h = false;
                            com.mnemonicstudios.novusapp.n.b = this.ak;
                            com.mnemonicstudios.novusapp.n.a.a(this.V);
                            com.mnemonicstudios.novusapp.n.d();
                            break;
                        }
                        case 1: {
                            this.g();
                            com.mnemonicstudios.novusapp.p.a(123, 0);
                            this.b(20);
                            break;
                        }
                        case 2: {
                            if (this.ak == 3) {
                                this.a(2);
                                break;
                            }
                            this.a(1);
                            break;
                        }
                        case 3: {
                            this.a(23);
                        }
                    }
                    break;
                }
                case 9: {
                    switch (this.U) {
                        case 0: {
                            com.mnemonicstudios.novusapp.n.h = false;
                            com.mnemonicstudios.novusapp.n.b = this.ak;
                            com.mnemonicstudios.novusapp.n.a.a(this.V);
                            com.mnemonicstudios.novusapp.n.d();
                            break;
                        }
                        case 1: {
                            this.a(16);
                            break;
                        }
                        case 2: {
                            this.g();
                            com.mnemonicstudios.novusapp.p.a(123, 0);
                            com.mnemonicstudios.novusapp.n.a.a = -1;
                            this.b(20);
                            break;
                        }
                        case 3: {
                            this.a(1);
                            break;
                        }
                        case 4: {
                            this.a(23);
                        }
                    }
                    break;
                }
                case 10: {
                    switch (this.U) {
                        case 0: {
                            this.a(11);
                            com.mnemonicstudios.novusapp.n.a.a = -1;
                            break;
                        }
                        case 1: {
                            this.g();
                            com.mnemonicstudios.novusapp.p.a(115, 0);
                            this.a(18);
                        }
                    }
                    break;
                }
                case 11: {
                    break;
                }
                case 12: {
                    if (com.mnemonicstudios.novusapp.o.a() < 2) break;
                    this.a(13);
                    break;
                }
                case 13: {
                    an = 13;
                    this.n = false;
                    this.a(15);
                    break;
                }
                case 14: {
                    break;
                }
                case 15: {
                    break;
                }
                case 17: {
                    com.mnemonicstudios.novusapp.n.b = 2;
                    com.mnemonicstudios.novusapp.n.a.a(this.V);
                    com.mnemonicstudios.novusapp.n.a.a();
                    com.mnemonicstudios.novusapp.o.f();
                    this.T = 0;
                    this.U = 0;
                    this.ad = 0;
                    while (this.ad < this.a[this.T].length) {
                        this.e[this.ad] = 0;
                        this.d[this.ad] = 0;
                        ++this.ad;
                    }
                    com.mnemonicstudios.novusapp.n.d();
                    break;
                }
                case 18: {
                    com.mnemonicstudios.novusapp.o.j();
                    this.a(11);
                    com.mnemonicstudios.novusapp.n.a.a = -1;
                    break;
                }
                case 19: {
                    com.mnemonicstudios.novusapp.o.f();
                    com.mnemonicstudios.novusapp.n.e = false;
                    break;
                }
                case 23: {
                    this.d = true;
                    com.mnemonicstudios.novusapp.n.b = 1;
                    com.mnemonicstudios.novusapp.n.a.d();
                    this.b(false);
                    break;
                }
                case 24: {
                    this.T = this.c;
                    this.U = 0;
                    this.X = this.W + this.S - this.a[this.T].length * 24 >> 1;
                    this.ad = 0;
                    while (this.ad < this.a[this.T].length) {
                        this.e[this.ad] = 0;
                        this.d[this.ad] = 0;
                        ++this.ad;
                    }
                    com.mnemonicstudios.novusapp.n.c();
                    break;
                }
                case 26: {
                    this.b(0);
                    break;
                }
                case 27: {
                    this.b(1);
                }
            }
            return;
        }
        if (com.mnemonicstudios.novusapp.n.d()) {
            switch (this.T) {
                case 0: {
                    return;
                }
                case 1: 
                case 2: {
                    com.mnemonicstudios.novusapp.o.f();
                    this.a(this.al);
                    return;
                }
                case 3: {
                    this.a(0);
                    return;
                }
                case 4: {
                    this.a(0);
                    return;
                }
                case 5: {
                    this.b(0);
                    return;
                }
                case 6: {
                    this.a(0);
                    return;
                }
                case 20: {
                    this.b(this.al);
                    return;
                }
                case 21: {
                    this.b(6);
                    return;
                }
                case 7: {
                    this.a(3);
                    return;
                }
                case 22: {
                    com.mnemonicstudios.novusapp.n.c();
                    this.b(7);
                    return;
                }
                case 8: {
                    com.mnemonicstudios.novusapp.n.h = false;
                    com.mnemonicstudios.novusapp.n.b = this.ak;
                    com.mnemonicstudios.novusapp.n.a.a(this.V);
                    com.mnemonicstudios.novusapp.n.d();
                    return;
                }
                case 9: {
                    com.mnemonicstudios.novusapp.n.h = false;
                    com.mnemonicstudios.novusapp.n.b = this.ak;
                    com.mnemonicstudios.novusapp.n.a.a(this.V);
                    com.mnemonicstudios.novusapp.n.d();
                    return;
                }
                case 10: {
                    this.a(0);
                    return;
                }
                case 11: {
                    return;
                }
                case 12: {
                    this.a(3);
                    return;
                }
                case 13: {
                    this.a(12);
                    return;
                }
                case 14: {
                    return;
                }
                case 15: {
                    return;
                }
                case 17: {
                    if (this.n) {
                        this.a(11);
                        return;
                    }
                    this.a(13);
                    return;
                }
                case 16: {
                    this.b(9);
                    return;
                }
                case 18: {
                    this.b(10);
                    com.mnemonicstudios.novusapp.n.a.a = -1;
                    return;
                }
                case 19: {
                    this.b(0);
                    return;
                }
                case 23: {
                    this.b(this.al);
                }
            }
        }
    }

    private void a(int n2) {
        switch (n2) {
            case 1: 
            case 2: 
            case 20: 
            case 23: {
                if (this.T == 27) break;
                this.al = this.T;
            }
        }
        this.ab = 0;
        this.aa = n2;
        this.o = true;
        if (n2 == 15 || n2 == 14) {
            if (n2 != 25) {
                com.mnemonicstudios.novusapp.n.a.e();
            }
            this.e = true;
            this.b = 0;
        }
    }

    private void b(int n2) {
        switch (n2) {
            case 1: 
            case 2: 
            case 20: 
            case 23: {
                if (this.T == 27) break;
                this.al = this.T;
            }
        }
        this.o = false;
        this.T = n2;
        this.U = 0;
        this.X = this.W + this.S - this.a[this.T].length * 24 >> 1;
        this.ad = 0;
        while (this.ad < this.a[this.T].length) {
            this.e[this.ad] = 0;
            this.d[this.ad] = 0;
            ++this.ad;
        }
        if (n2 == 15 || n2 == 14) {
            com.mnemonicstudios.novusapp.n.a.e();
            this.e = true;
            this.b = 0;
            return;
        }
        if (n2 == 25) {
            this.b = 0;
        }
    }

    private void d(Graphics graphics) {
        if (this.a == null) {
            this.j = this.R - 16;
            this.k = this.S - 16 >> 3;
            this.a = new int[this.j * this.k];
            this.n = 0;
            while (this.n < this.k) {
                this.m = 0;
                while (this.m < this.j) {
                    this.a[this.m + this.n * this.j] = this.o = -2147471360 + Math.abs((this.j >> 1) - this.m) * 2;
                    ++this.m;
                }
                ++this.n;
            }
        }
        this.l = 0;
        while (this.l < 8) {
            graphics.drawRGB(this.a, 0, this.j, 8, 8 + this.k * this.l, this.j, this.k, true);
            ++this.l;
        }
    }

    public final void b(Graphics graphics) {
        if (a && this.T != 24) {
            com.mnemonicstudios.novusapp.q.a(graphics);
            return;
        }
        if (com.mnemonicstudios.novusapp.n.b == 2) {
            return;
        }
        this.c(graphics);
        if (this.T != 13 && !this.f) {
            this.d(graphics);
        }
        if (com.mnemonicstudios.novusapp.n.b && !com.mnemonicstudios.novusapp.n.c && this.T != 24) {
            this.a(graphics, true);
            return;
        }
        this.e(graphics);
        switch (this.T) {
            case 0: {
                this.a(graphics, -1, 0);
                return;
            }
            case 1: 
            case 2: {
                boolean bl = false;
                if (this.U == 2) {
                    if (this.V == 0) {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, 113, this.R >> 1, this.X + 72 + (this.d[2] >> 8), 17, com.mnemonicstudios.novusapp.n.F);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, 112, this.R >> 1, this.X + 72 + (this.d[2] >> 8), 17, com.mnemonicstudios.novusapp.n.F);
                    }
                } else if (this.V == 0) {
                    com.mnemonicstudios.novusapp.n.a.b(graphics, 113, this.R >> 1, this.X + 72 + (this.d[2] >> 8), 17, com.mnemonicstudios.novusapp.n.F);
                } else {
                    com.mnemonicstudios.novusapp.n.a.b(graphics, 112, this.R >> 1, this.X + 72 + (this.d[2] >> 8), 17, com.mnemonicstudios.novusapp.n.F);
                }
                this.a(graphics, 2, 3);
                return;
            }
            case 3: {
                this.a(graphics, 2, 0);
                return;
            }
            case 4: {
                this.a(graphics, 2, 0);
                return;
            }
            case 6: {
                this.a(graphics, 2, 0);
                return;
            }
            case 5: {
                graphics.setColor(0xFFFF00);
                graphics.drawString(NovusMidlet.a, this.R >> 1, this.S - 2, 33);
            }
            case 20: {
                com.mnemonicstudios.novusapp.p.a(graphics);
                this.a(graphics, 2, -1);
                return;
            }
            case 21: {
                this.a(graphics, 2, -1);
                return;
            }
            case 7: {
                this.a(graphics, 2, 0);
                return;
            }
            case 22: {
                com.mnemonicstudios.novusapp.p.a(graphics);
                this.a(graphics, 2, 0);
                return;
            }
            case 8: {
                this.a(graphics, 2, 0);
                return;
            }
            case 9: {
                this.a(graphics, 2, 0);
                return;
            }
            case 10: {
                this.a(graphics, 2, 0);
                return;
            }
            case 11: {
                this.f(graphics);
                if (this.f) {
                    if (this.g) {
                        this.a(graphics, 2, 0);
                        return;
                    }
                    if (com.mnemonicstudios.novusapp.n.a) {
                        com.mnemonicstudios.novusapp.n.a.b(graphics, 135, this.R - 2, this.S, 40, com.mnemonicstudios.novusapp.n.F);
                        com.mnemonicstudios.novusapp.n.a.b(graphics, 134, 2, this.S, 36, com.mnemonicstudios.novusapp.n.F);
                        return;
                    }
                    com.mnemonicstudios.novusapp.n.a.b(graphics, 134, this.R - 2, this.S, 40, com.mnemonicstudios.novusapp.n.F);
                    com.mnemonicstudios.novusapp.n.a.b(graphics, 135, 2, this.S, 36, com.mnemonicstudios.novusapp.n.F);
                    return;
                }
                if (this.h) {
                    this.a(graphics, -1, 0);
                    return;
                }
                if (!p) {
                    com.mnemonicstudios.novusapp.n.a.b(graphics, 137, this.R >> 1, 24, 17, com.mnemonicstudios.novusapp.n.F);
                }
                this.a(graphics, 2, 0);
                return;
            }
            case 12: {
                com.mnemonicstudios.novusapp.n.a.b(graphics, 109, this.R >> 1, 24 + (this.d[0] >> 8), 17, com.mnemonicstudios.novusapp.n.H);
                com.mnemonicstudios.novusapp.n.a.b(graphics, 68, this.R >> 2, 40 + (this.d[0] >> 8), 17, com.mnemonicstudios.novusapp.n.H);
                com.mnemonicstudios.novusapp.n.a.b(graphics, 69, this.R - (this.R >> 2), 40 + (this.d[0] >> 8), 17, com.mnemonicstudios.novusapp.n.H);
                int n2 = 0;
                int n3 = 0;
                boolean bl = false;
                for (am = 0; am < b.length; ++am) {
                    switch (b[am]) {
                        case 0: {
                            n2 = this.R >> 2;
                            break;
                        }
                        case 1: {
                            n2 = this.R >> 1;
                            break;
                        }
                        case 2: {
                            n2 = this.R - (this.R >> 2);
                        }
                    }
                    n3 = 20 + (this.S >> 2) + am * 64 + (this.d[0] >> 8);
                    if (am == this.U) {
                        if (b[am] == 1 || b[am] == 2) {
                            a.defineReferencePixel(6, 8);
                            a.setTransform(2);
                            a.setRefPixelPosition(n2 - 16, n3 - 5);
                            a.paint(graphics);
                        }
                        if (b[am] == 1 || b[am] == 0) {
                            a.defineReferencePixel(6, 8);
                            a.setTransform(0);
                            a.setRefPixelPosition(n2 + 16, n3 - 5);
                            a.paint(graphics);
                        }
                    }
                    com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a[am], n2, n3, 0, 0);
                }
                if (com.mnemonicstudios.novusapp.o.a() >= 2) {
                    this.a(graphics, 2, 0);
                    return;
                }
                this.a(graphics, 2, -1);
                return;
            }
            case 13: {
                int n4 = 0;
                for (int i2 = com.mnemonicstudios.novusapp.d.b - 2; i2 < com.mnemonicstudios.novusapp.d.b + 3; ++i2) {
                    int n5 = i2;
                    if (n5 == com.mnemonicstudios.novusapp.d.b) continue;
                    if (n5 < 0) {
                        n5 += 5;
                    }
                    if (n5 > 4) {
                        n5 -= 5;
                    }
                    if (i2 < com.mnemonicstudios.novusapp.d.b) {
                        n4 = -40 * Math.abs(i2 - com.mnemonicstudios.novusapp.d.b);
                    } else if (i2 > com.mnemonicstudios.novusapp.d.b) {
                        n4 = 40 * Math.abs(i2 - com.mnemonicstudios.novusapp.d.b);
                    }
                    this.e.setRefPixelPosition((this.R >> 1) + n4, (this.S >> 1) + (this.d[0] >> 8));
                    this.e.setFrame(n5);
                    this.e.paint(graphics);
                }
                this.d(graphics);
                com.mnemonicstudios.novusapp.n.a.b(graphics, 110, this.R >> 1, 24 + (this.d[0] >> 8), 17, com.mnemonicstudios.novusapp.n.H);
                graphics.setColor(0);
                graphics.fillArc((this.R >> 1) - 24, (this.S >> 1) + (this.d[0] >> 8) - 24, 47, 47, 0, 360);
                graphics.setColor(0xEEEE00);
                graphics.fillArc((this.R >> 1) - 22, (this.S >> 1) + (this.d[0] >> 8) - 22, 43, 43, 0, 360);
                this.e.setFrame(com.mnemonicstudios.novusapp.d.b);
                this.e.setRefPixelPosition(this.R >> 1, (this.S >> 1) + (this.d[0] >> 8));
                this.e.paint(graphics);
                a.defineReferencePixel(6, 8);
                a.setTransform(2);
                a.setRefPixelPosition((this.R >> 1) - 32, (this.S >> 1) + (this.d[0] >> 8));
                a.paint(graphics);
                a.setTransform(0);
                a.setRefPixelPosition((this.R >> 1) + 32, (this.S >> 1) + (this.d[0] >> 8));
                a.paint(graphics);
                this.a(graphics, 2, 0);
                return;
            }
            case 25: {
                com.mnemonicstudios.novusapp.n.a.b(graphics, 6, this.R >> 1, this.S >> 1, 33, com.mnemonicstudios.novusapp.n.H);
            }
            case 14: {
                graphics.setColor(0);
                graphics.fillRect((this.R >> 1) - 51, this.S - 16, 102, 8);
                graphics.setColor(0xFFFF00);
                graphics.fillRect((this.R >> 1) - 50, this.S - 15, 12 + (this.b << 2), 6);
                this.a(graphics, -1, -1);
                return;
            }
            case 15: {
                graphics.setColor(0);
                graphics.fillRect((this.R >> 1) - 51, this.S - 16, 102, 8);
                graphics.setColor(0xFFFF00);
                graphics.fillRect((this.R >> 1) - 50, this.S - 15, 16 + (this.b << 2), 6);
                if (this.n) {
                    com.mnemonicstudios.novusapp.n.a.a(graphics, an, 0);
                } else {
                    com.mnemonicstudios.novusapp.n.a.b(graphics, 6, this.R >> 1, this.S >> 1, 33, com.mnemonicstudios.novusapp.n.H);
                }
                this.a(graphics, -1, -1);
                return;
            }
            case 16: {
                com.mnemonicstudios.novusapp.n.a.a(graphics, an, 0);
                this.a(graphics, 2, -1);
                return;
            }
            case 17: {
                if (this.n) {
                    com.mnemonicstudios.novusapp.n.a.a(graphics, an, 0);
                } else if (!p) {
                    if (a == 1) {
                        this.g();
                        com.mnemonicstudios.novusapp.p.a(137, 0);
                        com.mnemonicstudios.novusapp.p.a(graphics);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.b(graphics, 137, this.R >> 1, this.S >> 1, 17, com.mnemonicstudios.novusapp.n.F);
                    }
                }
                this.a(graphics, 2, 0);
                return;
            }
            case 18: {
                com.mnemonicstudios.novusapp.p.a(graphics);
                this.a(graphics, 1, 0);
                return;
            }
            case 19: 
            case 23: {
                com.mnemonicstudios.novusapp.n.a.b(graphics, 116, this.R >> 1, this.S >> 1, 17, com.mnemonicstudios.novusapp.n.F);
                this.a(graphics, 1, 0);
                return;
            }
            case 24: {
                this.a(graphics, -1, 0);
                return;
            }
            case 26: {
                com.mnemonicstudios.novusapp.p.a(graphics);
                this.a(graphics, -1, 0);
                return;
            }
            case 27: {
                com.mnemonicstudios.novusapp.p.a(graphics);
                this.a(graphics, -1, 0);
            }
        }
    }

    public static final int a() {
        int n2 = 0;
        for (am = 0; am < b.length; ++am) {
            if (b[am] == 1) continue;
            ++n2;
        }
        return n2;
    }

    private void e(Graphics graphics) {
        if (this.a[this.T][0] == -1) {
            return;
        }
        this.ac = 0;
        while (this.ac < this.a[this.T].length) {
            if ((this.T == 1 || this.T == 2) && this.ac < 2) {
                switch (this.ac) {
                    case 0: {
                        if (l) {
                            this.b.setFrame(0);
                            break;
                        }
                        this.b.setFrame(1);
                        break;
                    }
                    case 1: {
                        if (m) {
                            this.b.setFrame(0);
                            break;
                        }
                        this.b.setFrame(1);
                    }
                }
                this.b.setPosition(this.R - 20, this.X + this.ac * 24 + (this.d[this.ac] >> 8) - 14);
                this.b.paint(graphics);
                this.b.setPosition(2, this.X + this.ac * 24 + (this.d[this.ac] >> 8) - 14);
                this.b.paint(graphics);
            }
            if (this.ac == this.U) {
                com.mnemonicstudios.novusapp.n.a.a(graphics, this.a[this.T][this.U], 120 + this.Y, this.X + this.ac * 24 + (this.d[this.ac] >> 8), 17, com.mnemonicstudios.novusapp.n.G);
            } else if (this.a[this.T][this.ac] == 142) {
                com.mnemonicstudios.novusapp.n.a.b(graphics, this.a[this.T][this.ac], 120 + this.Y, this.X + this.ac * 24 + (this.d[this.ac] >> 8), 17, com.mnemonicstudios.novusapp.n.F);
            } else {
                com.mnemonicstudios.novusapp.n.a.b(graphics, this.a[this.T][this.ac], 120 + this.Y, this.X + this.ac * 24 + (this.d[this.ac] >> 8), 17, com.mnemonicstudios.novusapp.n.H);
            }
            ++this.ac;
        }
    }

    public final void a(Graphics graphics, int n2, int n3) {
        graphics.setClip(0, 0, this.R, this.S);
        if (n2 != -1) {
            this.b.setFrame(n2);
            if (com.mnemonicstudios.novusapp.n.a) {
                this.b.setPosition(this.R - 2 - this.b.getWidth(), this.S - 2 - this.b.getHeight());
                this.b.paint(graphics);
            } else {
                this.b.setPosition(2, this.S - 2 - this.b.getHeight());
                this.b.paint(graphics);
            }
        }
        if (n3 != -1) {
            this.b.setFrame(n3);
            if (com.mnemonicstudios.novusapp.n.a) {
                this.b.setPosition(2, this.S - 2 - this.b.getHeight());
                this.b.paint(graphics);
                return;
            }
            this.b.setPosition(this.R - 2 - this.b.getWidth(), this.S - 2 - this.b.getHeight());
            this.b.paint(graphics);
        }
    }

    private void i() {
        if (System.currentTimeMillis() - this.b > this.c) {
            this.b = System.currentTimeMillis();
            this.ai = com.mnemonicstudios.novusapp.n.a(this.b.length);
            this.c = 150 + com.mnemonicstudios.novusapp.n.a(500);
        }
        this.ae += this.ag;
        this.af += this.ah;
        if (this.ae > this.R + 48 << 8) {
            this.af = (this.S >> 2) + com.mnemonicstudios.novusapp.n.a(this.S >> 1) << 8;
            this.ag = -(256 + com.mnemonicstudios.novusapp.n.a(512));
            this.ah = 256 - com.mnemonicstudios.novusapp.n.a(512);
        } else if (this.ae < -12288) {
            this.af = (this.S >> 2) + com.mnemonicstudios.novusapp.n.a(this.S >> 1) << 8;
            this.ag = 256 + com.mnemonicstudios.novusapp.n.a(512);
            this.ah = 256 - com.mnemonicstudios.novusapp.n.a(512);
        }
        com.mnemonicstudios.novusapp.n.a.b();
    }

    public final void c(Graphics graphics) {
        graphics.setColor(0);
        graphics.fillRect(0, 0, this.R, this.S);
        graphics.drawImage(com.mnemonicstudios.novusapp.n.a, 0, 0, 20);
        if (com.mnemonicstudios.novusapp.n.b.getWidth() > 176) {
            graphics.drawImage(com.mnemonicstudios.novusapp.n.c, 0, 13, 20);
            graphics.drawImage(com.mnemonicstudios.novusapp.n.b, 0, 55, 20);
        } else {
            graphics.drawImage(com.mnemonicstudios.novusapp.n.c, 0, 8, 20);
            graphics.drawImage(com.mnemonicstudios.novusapp.n.b, 0, 40, 20);
        }
        com.mnemonicstudios.novusapp.n.a.b(graphics);
        this.c.setPosition(this.ae >> 8, this.af >> 8);
        this.c.paint(graphics);
        this.d.setPosition((this.ae >> 8) + this.b[this.ai][0], (this.af >> 8) + this.b[this.ai][1]);
        this.d.paint(graphics);
        this.d.setPosition((this.ae >> 8) + this.b[this.ai][2], (this.af >> 8) + this.b[this.ai][3]);
        this.d.paint(graphics);
    }

    public final void d() {
        if (com.mnemonicstudios.novusapp.n.a.b) {
            if (Q == 11) {
                this.g();
                com.mnemonicstudios.novusapp.p.a(136, 0);
                com.mnemonicstudios.novusapp.o.j();
                this.T = 26;
                return;
            }
            p = true;
            ap = 0;
            this.h = com.mnemonicstudios.novusapp.d.a;
            this.h = false;
            if (this.h) {
                this.g();
                com.mnemonicstudios.novusapp.p.a(117, 0);
                return;
            }
        } else {
            p = false;
        }
    }

    public final void e() {
        if (this.f) {
            com.mnemonicstudios.novusapp.p.a();
            if (com.mnemonicstudios.novusapp.n.d()) {
                this.f = false;
            } else if (com.mnemonicstudios.novusapp.n.c()) {
                if (this.g) {
                    com.mnemonicstudios.novusapp.n.d();
                    com.mnemonicstudios.novusapp.n.a[com.mnemonicstudios.novusapp.n.c].a(true);
                    if (com.mnemonicstudios.novusapp.n.c == 2) {
                        this.b(25);
                    } else {
                        com.mnemonicstudios.novusapp.n.b = 3;
                        com.mnemonicstudios.novusapp.n.a.a(0);
                    }
                    this.f = false;
                } else {
                    this.g = true;
                    int n2 = com.mnemonicstudios.novusapp.n.a(1000);
                    this.g();
                    if (n2 < 250) {
                        com.mnemonicstudios.novusapp.n.c = 0;
                        com.mnemonicstudios.novusapp.p.a(119, 0);
                    } else if (n2 < 500) {
                        com.mnemonicstudios.novusapp.n.c = 1;
                        com.mnemonicstudios.novusapp.p.a(121, 0);
                    } else if (n2 < 750) {
                        com.mnemonicstudios.novusapp.n.c = 2;
                        com.mnemonicstudios.novusapp.p.a(120, 0);
                    } else {
                        com.mnemonicstudios.novusapp.n.c = 3;
                        com.mnemonicstudios.novusapp.p.a(122, 0);
                    }
                }
                com.mnemonicstudios.novusapp.n.d();
            }
        } else if (this.h) {
            if (com.mnemonicstudios.novusapp.n.c()) {
                this.h = false;
            }
        } else if (this.i) {
            this.C += this.H;
            this.D += this.I;
            this.k = true;
            if (!this.j && this.C >= this.A + (this.E - this.A >> 1)) {
                this.j = true;
                this.f = true;
                this.g = false;
                this.g();
                com.mnemonicstudios.novusapp.p.a(103, 0);
            } else if (this.C >= this.E) {
                this.J = this.M;
                this.i = false;
                p = false;
                this.O = 0;
                Q = this.a[Q][1][ap];
            }
        } else {
            this.E = this.a[Q][0][3] + com.mnemonicstudios.novusapp.n.a(32);
            this.F = this.a[Q][0][4] + com.mnemonicstudios.novusapp.n.a(32);
            this.L = 48;
            this.M = 192;
            if (this.C > this.E + 128) {
                this.k = false;
            }
            if (this.C < this.E - 128) {
                this.k = true;
            }
            if (this.C > this.E) {
                this.J -= this.L;
                if (this.J < -this.M) {
                    this.J = -this.M;
                }
            } else {
                this.J += this.L;
                if (this.J > this.M) {
                    this.J = this.M;
                }
            }
            if (this.D > this.F) {
                this.K -= this.L;
                if (this.K < -this.M) {
                    this.K = -this.M;
                }
            } else {
                this.K += this.L;
                if (this.K > this.M) {
                    this.K = this.M;
                }
            }
            this.C += this.J;
            this.D += this.K;
            this.s = 8;
            if (com.mnemonicstudios.novusapp.n.i) {
                if (this.r < this.s) {
                    ++this.r;
                }
            } else if (com.mnemonicstudios.novusapp.n.j) {
                if (this.r > -this.s) {
                    --this.r;
                }
            } else {
                if (this.r > 0) {
                    --this.r;
                } else if (this.r < 0) {
                    ++this.r;
                }
                if (this.N < this.a[Q][0][3] >> 4) {
                    ++this.O;
                    if (this.O > this.s) {
                        this.O = this.s;
                    }
                    this.N += this.O;
                    if (this.N > this.a[Q][0][3] >> 4) {
                        this.N = this.a[Q][0][3] >> 4;
                    }
                } else if (this.N > this.a[Q][0][3] >> 4) {
                    --this.O;
                    if (this.O < -this.s) {
                        this.O = -this.s;
                    }
                    this.N += this.O;
                    if (this.N < this.a[Q][0][3] >> 4) {
                        this.N = this.a[Q][0][3] >> 4;
                    }
                }
            }
            if (p && this.a[Q][1][0] != -1) {
                if (com.mnemonicstudios.novusapp.n.k) {
                    com.mnemonicstudios.novusapp.n.k = false;
                    if (++ap >= this.a[Q][1].length) {
                        ap = 0;
                    }
                } else if (com.mnemonicstudios.novusapp.n.l) {
                    com.mnemonicstudios.novusapp.n.l = false;
                    if (--ap < 0) {
                        ap = this.a[Q][1].length - 1;
                    }
                } else if (com.mnemonicstudios.novusapp.n.m || com.mnemonicstudios.novusapp.n.c()) {
                    com.mnemonicstudios.novusapp.n.m = false;
                    this.i = true;
                    this.j = false;
                    this.A = this.a[Q][0][3];
                    this.B = this.a[Q][0][4];
                    this.C = this.A;
                    this.D = this.B;
                    this.E = this.a[this.a[Q][1][ap]][0][3];
                    this.F = this.a[this.a[Q][1][ap]][0][4];
                    this.G = 50;
                    this.H = (this.E - this.A) / this.G;
                    this.I = (this.F - this.B) / this.G;
                }
            }
            this.N -= this.r;
            if (com.mnemonicstudios.novusapp.n.c() || com.mnemonicstudios.novusapp.n.m) {
                com.mnemonicstudios.novusapp.d.b = this.a[Q][0][0];
                an = this.a[Q][0][2];
                com.mnemonicstudios.novusapp.n.m = false;
                this.n = true;
                this.a(15);
            } else if (com.mnemonicstudios.novusapp.n.d()) {
                this.a(3);
            }
        }
        switch (this.w) {
            case 0: {
                if (System.currentTimeMillis() - this.a <= 100L) break;
                this.a = System.currentTimeMillis();
                this.x = -12 + com.mnemonicstudios.novusapp.n.a(24);
                this.y = -12 + com.mnemonicstudios.novusapp.n.a(24);
                if (com.mnemonicstudios.novusapp.n.a(1000) > 700) {
                    this.w = 1;
                    return;
                }
                this.w = 2;
                if (Math.abs(this.x) < 8) {
                    this.x = this.x < 0 ? (this.x -= 8) : (this.x += 8);
                }
                if (Math.abs(this.y) < 8) {
                    this.y = this.y < 0 ? (this.y -= 8) : (this.y += 8);
                }
                if (this.x < 0 && this.y < 0) {
                    this.h.setTransform(6);
                    return;
                }
                if (this.x < 0 && this.y > 0) {
                    this.h.setTransform(3);
                    return;
                }
                if (this.x > 0 && this.y > 0) {
                    this.h.setTransform(5);
                    return;
                }
                this.h.setTransform(0);
                return;
            }
            case 1: {
                if (System.currentTimeMillis() - this.a <= 50L) break;
                this.a = System.currentTimeMillis();
                this.g.nextFrame();
                if (this.g.getFrame() != 0) break;
                this.w = 0;
                return;
            }
            case 2: {
                if (System.currentTimeMillis() - this.a <= 50L) break;
                this.a = System.currentTimeMillis();
                this.h.nextFrame();
                if (this.h.getFrame() != 0) break;
                this.w = 0;
            }
        }
    }

    private void f(Graphics graphics) {
        this.g.defineReferencePixel(this.g.getWidth() >> 1, this.g.getHeight() >> 1);
        this.h.defineReferencePixel(this.h.getWidth() >> 1, this.h.getHeight() >> 1);
        this.p = (this.R >> 2) - this.N;
        if (this.p > 80) {
            this.r = 0;
            this.p = 80;
        } else if (this.p < -380) {
            this.r = 0;
            this.p = -380;
        }
        this.q = this.S >> 1;
        this.u = 0;
        while (this.u < this.a.length) {
            this.v = 0;
            while (this.v < this.a[this.u][1].length) {
                if (p && this.u == Q && this.a[this.u][1][this.v] == this.a[Q][1][ap]) {
                    graphics.setColor(65280);
                } else {
                    graphics.setColor(0xEEEE00);
                }
                if (this.a[this.u][1][0] != -1) {
                    this.P = 0;
                    while (this.P < this.c.length) {
                        if (Math.abs(this.c[this.P]) >= 2) {
                            graphics.setColor(0);
                        }
                        graphics.drawLine(this.p + (this.a[this.u][0][3] >> 4), this.q + (this.a[this.u][0][4] >> 4) + (this.d[0] >> 8) + this.c[this.P], this.p + (this.a[this.a[this.u][1][this.v]][0][3] >> 4), this.q + (this.a[this.a[this.u][1][this.v]][0][4] >> 4) + (this.d[0] >> 8) + this.c[this.P]);
                        ++this.P;
                    }
                }
                ++this.v;
            }
            ++this.u;
        }
        this.t = 0;
        while (this.t < this.a.length) {
            if (p && this.a[Q][1][ap] == this.t) {
                graphics.setColor(0);
                graphics.fillArc(this.p + (this.a[this.t][0][3] >> 4) - 24, this.q + (this.a[this.t][0][4] >> 4) + (this.d[0] >> 8) - 24, 47, 47, 0, 360);
                graphics.setColor(65280);
                graphics.fillArc(this.p + (this.a[this.t][0][3] >> 4) - 22, this.q + (this.a[this.t][0][4] >> 4) + (this.d[0] >> 8) - 22, 43, 43, 0, 360);
            } else if (this.t == Q) {
                graphics.setColor(0);
                graphics.fillArc(this.p + (this.a[this.t][0][3] >> 4) - 24, this.q + (this.a[this.t][0][4] >> 4) + (this.d[0] >> 8) - 24, 47, 47, 0, 360);
                graphics.setColor(0xFF0000);
                graphics.fillArc(this.p + (this.a[this.t][0][3] >> 4) - 22, this.q + (this.a[this.t][0][4] >> 4) + (this.d[0] >> 8) - 22, 43, 43, 0, 360);
            }
            if (this.t == Q && !this.k) {
                this.k.defineReferencePixel(10, 8);
                this.k.setRefPixelPosition(this.p + (this.C >> 4), this.q + (this.D >> 4) + (this.d[0] >> 8));
                this.k.paint(graphics);
            }
            this.e.setFrame(this.a[this.t][0][0]);
            this.e.setRefPixelPosition(this.p + (this.a[this.t][0][3] >> 4), this.q + (this.a[this.t][0][4] >> 4) + (this.d[0] >> 8));
            this.e.paint(graphics);
            if ((this.a[this.t][0][1] & 2) > 0) {
                this.i.setTransform(0);
                this.i.setRefPixelPosition(this.p + (this.a[this.t][0][3] >> 4) - this.i.getWidth(), this.q + (this.a[this.t][0][4] >> 4) - 6 + (this.d[0] >> 8));
                this.i.paint(graphics);
                this.i.setTransform(2);
                this.i.setRefPixelPosition(this.p + (this.a[this.t][0][3] >> 4) + this.i.getWidth() - 1, this.q + (this.a[this.t][0][4] >> 4) - 6 + (this.d[0] >> 8));
                this.i.paint(graphics);
            }
            if ((this.a[this.t][0][1] & 1) > 0) {
                this.f.setTransform(0);
                this.f.setRefPixelPosition(this.p + (this.a[this.t][0][3] >> 4) + 8, this.q + (this.a[this.t][0][4] >> 4) + 8 + (this.d[0] >> 8));
                this.f.paint(graphics);
            }
            ++this.t;
        }
        this.z = p && this.a[Q][1][0] != -1 ? this.a[Q][1][ap] : Q;
        switch (this.w) {
            case 1: {
                this.g.setRefPixelPosition(this.p + (this.a[this.z][0][3] >> 4) + this.x, this.q + (this.a[this.z][0][4] >> 4) + (this.d[0] >> 8) + this.y);
                this.g.paint(graphics);
                break;
            }
            case 2: {
                this.h.setRefPixelPosition(this.p + (this.a[this.z][0][3] >> 4) + this.x, this.q + (this.a[this.z][0][4] >> 4) + (this.d[0] >> 8) + this.y);
                this.h.paint(graphics);
            }
        }
        if (this.k) {
            this.k.defineReferencePixel(10, 8);
            this.k.setRefPixelPosition(this.p + (this.C >> 4), this.q + (this.D >> 4) + (this.d[0] >> 8));
            this.k.paint(graphics);
        }
        if (p && !this.f && !this.i && !this.h) {
            com.mnemonicstudios.novusapp.n.a.b(graphics, 110, this.R >> 1, 24 + (this.d[0] >> 8), 17, com.mnemonicstudios.novusapp.n.H);
        }
        if (this.f | this.h) {
            this.d(graphics);
            com.mnemonicstudios.novusapp.p.a(graphics);
        }
    }

    private static void j() {
        Q = 0;
        an = 1;
        ao = 0;
        p = false;
        ap = 0;
    }

    private static void k() {
        try {
            ar = 0;
            com.mnemonicstudios.novusapp.o.a[com.mnemonicstudios.novusapp.o.ar++] = 1;
            com.mnemonicstudios.novusapp.o.a(Q, ar);
            com.mnemonicstudios.novusapp.o.a(an, ar += 4);
            com.mnemonicstudios.novusapp.o.a(ao, ar += 4);
            ar += 4;
            com.mnemonicstudios.novusapp.o.a[com.mnemonicstudios.novusapp.o.ar++] = p ? (byte)1 : 0;
            com.mnemonicstudios.novusapp.o.a(ap, ar);
            ar += 4;
            com.mnemonicstudios.novusapp.o.a[com.mnemonicstudios.novusapp.o.ar++] = l ? (byte)1 : 0;
            com.mnemonicstudios.novusapp.o.a[com.mnemonicstudios.novusapp.o.ar++] = m ? (byte)1 : 0;
            for (int i2 = 0; i2 < com.mnemonicstudios.novusapp.d.a.length; ++i2) {
                com.mnemonicstudios.novusapp.o.a(com.mnemonicstudios.novusapp.d.a[i2], ar);
                ar += 4;
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final void f() {
        if (com.mnemonicstudios.novusapp.n.b) {
            return;
        }
        com.mnemonicstudios.novusapp.o.k();
        try {
            a = RecordStore.openRecordStore((String)"WORMS2008RMS", (boolean)true);
            if (a.getNumRecords() == 0) {
                a.addRecord(a, 0, a.length);
            } else {
                a.setRecord(1, a, 0, a.length);
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public static final boolean b() {
        try {
            a = RecordStore.openRecordStore((String)"WORMS2008RMS", (boolean)false);
            if (a.getNumRecords() == 0) {
                a.closeRecordStore();
                return false;
            }
            a.getRecord(1, a, 0);
            a.closeRecordStore();
            ar = 0;
            if (a[ar++] != 1) {
                return false;
            }
            Q = com.mnemonicstudios.novusapp.o.a(ar);
            an = com.mnemonicstudios.novusapp.o.a(ar += 4);
            ao = com.mnemonicstudios.novusapp.o.a(ar += 4);
            ar += 4;
            p = a[ar++] == 1;
            ap = com.mnemonicstudios.novusapp.o.a(ar);
            ar += 4;
            l = a[ar++] == 1;
            m = a[ar++] == 1;
            for (int i2 = 0; i2 < com.mnemonicstudios.novusapp.d.a.length; ++i2) {
                com.mnemonicstudios.novusapp.d.a[i2] = com.mnemonicstudios.novusapp.o.a(ar);
                ar += 4;
            }
            return true;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return false;
        }
    }

    private static void a(int n2, int n3) {
        com.mnemonicstudios.novusapp.o.a[n3] = a = (byte)(n2 & 0xFF);
        com.mnemonicstudios.novusapp.o.a[n3 + 1] = a = (byte)(n2 >> 8 & 0xFF);
        com.mnemonicstudios.novusapp.o.a[n3 + 2] = a = (byte)(n2 >> 16 & 0xFF);
        com.mnemonicstudios.novusapp.o.a[n3 + 3] = a = (byte)(n2 >> 24 & 0xFF);
    }

    private static int a(int n2) {
        try {
            as = a[n2];
            at = a[n2 + 1];
            au = a[n2 + 2];
            av = a[n2 + 3];
            if (as < 0) {
                as += 256;
            }
            if (at < 0) {
                at += 256;
            }
            if (au < 0) {
                au += 256;
            }
            if (av < 0) {
                av += 256;
            }
            return (av << 24) + (au << 16) + (at << 8) + as;
        }
        catch (Exception exception) {
            return 0;
        }
    }

    public final void g() {
        com.mnemonicstudios.novusapp.p.a(4, 16 + (this.d[0] >> 8), this.R - 8, this.S - 48);
    }

    static {
        a = 0;
        b = new int[]{1, 1, 1, 1};
        Q = 0;
        a = new byte[512];
    }
}


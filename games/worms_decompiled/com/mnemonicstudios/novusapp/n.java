/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Font
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 *  javax.microedition.lcdui.game.GameCanvas
 *  javax.microedition.lcdui.game.Sprite
 *  javax.microedition.media.Manager
 *  javax.microedition.media.MediaException
 *  javax.microedition.media.Player
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.NovusMidlet;
import com.mnemonicstudios.novusapp.a;
import com.mnemonicstudios.novusapp.b;
import com.mnemonicstudios.novusapp.c;
import com.mnemonicstudios.novusapp.d;
import com.mnemonicstudios.novusapp.e;
import com.mnemonicstudios.novusapp.f;
import com.mnemonicstudios.novusapp.g;
import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.k;
import com.mnemonicstudios.novusapp.l;
import com.mnemonicstudios.novusapp.m;
import com.mnemonicstudios.novusapp.o;
import com.mnemonicstudios.novusapp.p;
import com.mnemonicstudios.novusapp.q;
import com.mnemonicstudios.novusapp.r;
import com.mnemonicstudios.novusapp.s;
import java.io.IOException;
import java.io.InputStream;
import java.util.Random;
import javax.microedition.lcdui.Font;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.GameCanvas;
import javax.microedition.lcdui.game.Sprite;
import javax.microedition.media.Manager;
import javax.microedition.media.MediaException;
import javax.microedition.media.Player;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class n
extends GameCanvas
implements Runnable {
    public static boolean a = true;
    public static int a = 60;
    public static long a;
    public static boolean b;
    public static boolean c;
    public static boolean d;
    public static String a;
    public static Thread a;
    public static boolean e;
    public static b a;
    public static j a;
    public static k a;
    public static e a;
    public static d a;
    public static int b;
    public static i a;
    public static o a;
    public static r a;
    public static g a;
    public static p a;
    public static m[] a;
    public static q a;
    public static int c;
    public static Image a;
    public static Image b;
    public static Image c;
    public static Image d;
    public static Image e;
    public static boolean f;
    public static int d;
    public static Exception a;
    static boolean g;
    public static boolean h;
    public static Font a;
    static Random a;
    static boolean i;
    static boolean j;
    static boolean k;
    static boolean l;
    static boolean m;
    static boolean n;
    static boolean o;
    static boolean p;
    static boolean q;
    static boolean r;
    static int e;
    static int f;
    public static Font b;
    public static int g;
    private static int[][] b;
    public static InputStream a;
    static int h;
    static int i;
    static int[] a;
    static int[] b;
    static int[] c;
    static int[] d;
    static int[] e;
    static int[] f;
    static int[] g;
    static int[] h;
    static int[] i;
    static int[] j;
    static int[] k;
    static int[] l;
    static int[] m;
    static int[] n;
    static int[] o;
    static int[] p;
    static int[] q;
    static int[] r;
    static int j;
    static int k;
    static int l;
    static int m;
    static int n;
    static int o;
    static int p;
    static int q;
    static int r;
    static int s;
    static int t;
    static int u;
    static int v;
    static int[][] a;
    static int w;
    static int x;
    static int y;
    static int z;
    static int A;
    static int B;
    static int C;
    static int D;
    static int E;
    static int F;
    static int G;
    static int H;
    static int I;
    static int J;
    static int K;
    static int L;
    static int M;
    static int N;
    static int O;
    static int P;
    static int Q;
    static int R;
    int S = 0;
    int T = 100;
    public static s a;
    static String[] a;
    static String[] b;
    static String[] c;
    public static Player a;
    public static int U;
    public static Player[] a;
    private static long b;

    public n() {
        super(false);
    }

    public final void a() {
        e = true;
        a = new Thread(this);
        a.start();
    }

    public final void run() {
        Runtime.getRuntime();
        long l2 = 0L;
        long l3 = 0L;
        a.a();
        while (e) {
            try {
                l2 = System.currentTimeMillis();
                this.repaint();
                l3 = System.currentTimeMillis() - l2;
                if (l3 < 50L) {
                    Thread.sleep(50L - l3);
                    continue;
                }
                Thread.sleep(a);
            }
            catch (Exception exception) {}
        }
        com.mnemonicstudios.novusapp.n.d();
        NovusMidlet.a.a();
    }

    public final void paint(Graphics graphics) {
        if (b && c && System.currentTimeMillis() - a > 240000L) {
            a.d(false);
            a.a(graphics, false);
            return;
        }
        try {
            if (g) {
                return;
            }
            g = true;
            graphics.setFont(com.mnemonicstudios.novusapp.s.a);
            a.a(graphics);
            if (d > 0) {
                b = 7;
            }
            switch (b) {
                case 7: {
                    graphics.setColor(255, 0, 0);
                    graphics.fillRect(0, 0, 240, 320);
                    graphics.setColor(0, 0, 0);
                    graphics.drawString("MPSOA:", 2, 2, 20);
                    graphics.drawString("Error code: " + d, 16, 16, 20);
                    graphics.drawString("Exception: " + a.getMessage(), 16, 32, 20);
                    if (!com.mnemonicstudios.novusapp.n.b()) break;
                    e = false;
                    break;
                }
                case 5: {
                    b = 6;
                    com.mnemonicstudios.novusapp.q.a();
                    com.mnemonicstudios.novusapp.n.a[0] = new l();
                    com.mnemonicstudios.novusapp.n.a[1] = new c();
                    com.mnemonicstudios.novusapp.n.a[2] = new f();
                    com.mnemonicstudios.novusapp.n.a[3] = new a();
                    a.a();
                    break;
                }
                case 6: {
                    if (a.a()) {
                        try {
                            d = Image.createImage((String)"/splashTHQ.png");
                            e = Image.createImage((String)"/worms2008_team17logo.png");
                        }
                        catch (Exception exception) {
                            Exception exception2 = exception;
                            exception.printStackTrace();
                        }
                        b = 4;
                        break;
                    }
                    a.a(graphics);
                    break;
                }
                case 4: {
                    if (this.S < 35) {
                        graphics.setColor(0xFFFFFF);
                        graphics.fillRect(0, 0, this.getWidth(), this.getHeight());
                        graphics.drawImage(d, 240 - d.getWidth() >> 1, 320 - d.getHeight() >> 1, 20);
                    } else if (this.S < 70) {
                        graphics.setColor(0xFFFFFF);
                        graphics.fillRect(0, 0, this.getWidth(), this.getHeight());
                        graphics.drawImage(e, 240 - e.getWidth() >> 1, 320 - e.getHeight() >> 1, 20);
                    } else {
                        graphics.setColor(0);
                        graphics.fillRect(0, 0, this.getWidth(), this.getHeight());
                        graphics.drawImage(a, 0, 0, 20);
                        if (b.getWidth() > 176) {
                            graphics.drawImage(c, 0, 13, 20);
                            graphics.drawImage(b, 0, 55, 20);
                        } else {
                            graphics.drawImage(c, 0, 8, 20);
                            graphics.drawImage(b, 0, 40, 20);
                        }
                        graphics.setColor(0);
                        graphics.fillRect(69, 304, 102, 8);
                        graphics.setColor(0xFFFF00);
                        graphics.fillRect(70, 305, this.S, 6);
                    }
                    if (!this.e()) break;
                    d = null;
                    e = null;
                    System.gc();
                    try {
                        b = NovusMidlet.a.getAppProperty("Demo-Enabled").equals("true");
                    }
                    catch (Exception exception) {
                        b = false;
                    }
                    if (b) {
                        c = false;
                    }
                    b = 1;
                    a.a(0);
                    com.mnemonicstudios.novusapp.n.c();
                    break;
                }
                case 1: {
                    a.b();
                    a.b(graphics);
                    break;
                }
                case 2: {
                    if (com.mnemonicstudios.novusapp.n.a.d) {
                        b = 1;
                        a.a(0);
                        com.mnemonicstudios.novusapp.n.a.d = false;
                        return;
                    }
                    f = false;
                    a.n();
                    a.c(graphics);
                    break;
                }
                case 3: {
                    if (com.mnemonicstudios.novusapp.n.a.d) {
                        b = 1;
                        a.a(0);
                        com.mnemonicstudios.novusapp.n.a.d = false;
                        return;
                    }
                    a[c].e();
                    a[c].b(graphics);
                }
            }
            g = false;
            return;
        }
        catch (Exception exception) {
            g = false;
            exception.printStackTrace();
            return;
        }
    }

    public final void hideNotify() {
        h = true;
        try {
            if (a != null) {
                a.stop();
            }
            return;
        }
        catch (MediaException mediaException) {
            return;
        }
    }

    public final void showNotify() {
        n = false;
        o = false;
        p = false;
        k = false;
        l = false;
        i = false;
        j = false;
        m = false;
    }

    public static final void a(Graphics graphics, String string, int n2, int n3, int n4, int n5) {
        graphics.drawString(string, n2, n3, n4);
    }

    public static final int a(int n2) {
        if (n2 == 0) {
            return 0;
        }
        int n3 = a.nextInt() % n2;
        if (n3 < 0) {
            n3 += n2;
        }
        return n3;
    }

    protected final void keyPressed(int n2) {
        f = n2;
        switch (f) {
            case -6: {
                r = false;
                q = true;
                return;
            }
            case -7: {
                r = true;
                q = false;
                return;
            }
        }
        e = this.getGameAction(f);
        switch (f) {
            case 48: {
                return;
            }
            case 49: {
                n = true;
                return;
            }
            case 50: {
                k = true;
                return;
            }
            case 51: {
                return;
            }
            case 52: {
                i = true;
                return;
            }
            case 53: {
                m = true;
                return;
            }
            case 54: {
                j = true;
                return;
            }
            case 55: {
                o = true;
                return;
            }
            case 56: {
                l = true;
                return;
            }
            case 57: {
                p = true;
                return;
            }
            case 35: {
                return;
            }
            case 42: {
                return;
            }
            case -6: {
                q = true;
                r = false;
                return;
            }
            case -7: {
                q = false;
                r = true;
                return;
            }
        }
        switch (e) {
            case 2: {
                i = true;
                return;
            }
            case 5: {
                j = true;
                return;
            }
            case 1: {
                k = true;
                return;
            }
            case 6: {
                l = true;
                return;
            }
            case 8: {
                m = true;
            }
        }
    }

    protected final void keyReleased(int n2) {
        f = n2;
        switch (f) {
            case -6: {
                r = false;
                q = false;
                return;
            }
            case -7: {
                r = false;
                q = false;
                return;
            }
        }
        e = this.getGameAction(f);
        switch (f) {
            case 48: {
                return;
            }
            case 49: {
                n = false;
                return;
            }
            case 50: {
                k = false;
                return;
            }
            case 51: {
                return;
            }
            case 52: {
                i = false;
                return;
            }
            case 53: {
                m = false;
                return;
            }
            case 54: {
                j = false;
                return;
            }
            case 55: {
                o = false;
                return;
            }
            case 56: {
                l = false;
                return;
            }
            case 57: {
                p = false;
                return;
            }
            case 35: {
                return;
            }
            case 42: {
                return;
            }
            case -6: {
                q = false;
                r = false;
                return;
            }
            case -7: {
                q = false;
                r = false;
                return;
            }
        }
        switch (e) {
            case 2: {
                i = false;
                return;
            }
            case 5: {
                j = false;
                return;
            }
            case 1: {
                k = false;
                return;
            }
            case 6: {
                l = false;
                return;
            }
            case 8: {
                m = false;
            }
        }
    }

    public static final void a(Graphics graphics, String string, Font font, int n2, int n3, int n4, int n5, int n6) {
        if (font == null) {
            font = a;
        }
        graphics.setFont(font);
        graphics.setColor(n6);
        for (g = 0; g < b.length; ++g) {
            com.mnemonicstudios.novusapp.n.a(graphics, string, n2 + b[g][0], n3 + b[g][1], n4, 0);
        }
        graphics.setColor(n5);
        graphics.drawString(string, n2, n3, n4);
        com.mnemonicstudios.novusapp.n.a(graphics, string, n2, n3, n4, 0);
    }

    public static final boolean a() {
        if (q) {
            q = false;
            return true;
        }
        return false;
    }

    public static final boolean b() {
        if (r) {
            r = false;
            return true;
        }
        return false;
    }

    public static final boolean c() {
        if (a) {
            if (q) {
                q = false;
                return true;
            }
        } else if (r) {
            r = false;
            return true;
        }
        return false;
    }

    public static final boolean d() {
        if (a) {
            if (r) {
                r = false;
                return true;
            }
        } else if (q) {
            q = false;
            return true;
        }
        return false;
    }

    public final boolean e() {
        try {
            switch (this.S) {
                case 0: {
                    com.mnemonicstudios.novusapp.n.b();
                    break;
                }
                case 1: {
                    h = a.a("worms_arrow.png", 16, 24);
                    break;
                }
                case 2: {
                    b = Image.createImage((String)("/wormsASO_splash_logo_" + com.mnemonicstudios.novusapp.o.a + ".png"));
                    c = Image.createImage((String)"/wormsASO_splash_logo_top.png");
                    break;
                }
                case 3: {
                    i = a.a("worms_crosshair.png", 24, 24);
                    a = Image.createImage((String)"/wormsASO_splash.png");
                    break;
                }
                case 4: {
                    com.mnemonicstudios.novusapp.n.a[0] = a.a("worms2008_norm_move_X17Y19.png", 17, 19);
                    com.mnemonicstudios.novusapp.n.b[0] = a.a("worms_normworm_bighit_XY25.png", 25, 25);
                    break;
                }
                case 5: {
                    com.mnemonicstudios.novusapp.n.c[0] = a.a("worms_normworm_jump_X10Y25.png", 10, 25);
                    com.mnemonicstudios.novusapp.n.d[0] = a.a("worms_normworm_death_X19Y24.png", 19, 24);
                    break;
                }
                case 6: {
                    com.mnemonicstudios.novusapp.n.e[0] = a.a("worms2008_norm_rocketaim_X18Y20.png", 18, 20);
                    com.mnemonicstudios.novusapp.n.f[0] = a.a("worms_norm_win_X17Y32.png", 17, 32);
                    break;
                }
                case 7: {
                    com.mnemonicstudios.novusapp.n.g[0] = a.a("worms_timefrag_norm.png", 14, 19);
                    com.mnemonicstudios.novusapp.n.i[0] = a.a("worms_clusterfrag_norm.png", 18, 21);
                    break;
                }
                case 8: {
                    com.mnemonicstudios.novusapp.n.k[0] = a.a("worms_robosheep_norm.png", 17, 21);
                    com.mnemonicstudios.novusapp.n.l[0] = a.a("worms_norm_teleport_XY21.png", 21, 21);
                    break;
                }
                case 9: {
                    com.mnemonicstudios.novusapp.n.m[0] = a.a("worms_norm_backflip_XY25.png", 25, 25);
                    com.mnemonicstudios.novusapp.n.o[0] = a.a("worms_norm_laserrifle_X22Y19.png", 22, 19);
                    break;
                }
                case 10: {
                    com.mnemonicstudios.novusapp.n.p[0] = a.a("worms_norm_jetpack_X16Y25.png", 16, 25);
                    com.mnemonicstudios.novusapp.n.q[0] = a.a("worms_astropunch_norm.png", 17, 19);
                    break;
                }
                case 11: {
                    com.mnemonicstudios.novusapp.n.r[0] = a.a("worms_excavator_norm.png", 23, 24);
                    com.mnemonicstudios.novusapp.n.a[1] = a[0];
                    com.mnemonicstudios.novusapp.n.b[1] = b[0];
                    com.mnemonicstudios.novusapp.n.c[1] = c[0];
                    com.mnemonicstudios.novusapp.n.d[1] = d[0];
                    com.mnemonicstudios.novusapp.n.e[1] = e[0];
                    com.mnemonicstudios.novusapp.n.f[1] = f[0];
                    com.mnemonicstudios.novusapp.n.g[1] = g[0];
                    com.mnemonicstudios.novusapp.n.i[1] = i[0];
                    com.mnemonicstudios.novusapp.n.k[1] = k[0];
                    com.mnemonicstudios.novusapp.n.l[1] = l[0];
                    com.mnemonicstudios.novusapp.n.m[1] = m[0];
                    com.mnemonicstudios.novusapp.n.o[1] = o[0];
                    com.mnemonicstudios.novusapp.n.p[1] = p[0];
                    com.mnemonicstudios.novusapp.n.q[1] = q[0];
                    com.mnemonicstudios.novusapp.n.r[1] = r[0];
                    com.mnemonicstudios.novusapp.n.a[2] = a[0];
                    com.mnemonicstudios.novusapp.n.b[2] = b[0];
                    com.mnemonicstudios.novusapp.n.c[2] = c[0];
                    com.mnemonicstudios.novusapp.n.d[2] = d[0];
                    com.mnemonicstudios.novusapp.n.e[2] = e[0];
                    com.mnemonicstudios.novusapp.n.f[2] = f[0];
                    com.mnemonicstudios.novusapp.n.g[2] = g[0];
                    com.mnemonicstudios.novusapp.n.i[2] = i[0];
                    com.mnemonicstudios.novusapp.n.k[2] = k[0];
                    com.mnemonicstudios.novusapp.n.l[2] = l[0];
                    com.mnemonicstudios.novusapp.n.m[2] = m[0];
                    com.mnemonicstudios.novusapp.n.o[2] = o[0];
                    com.mnemonicstudios.novusapp.n.p[2] = p[0];
                    com.mnemonicstudios.novusapp.n.q[2] = q[0];
                    com.mnemonicstudios.novusapp.n.r[2] = r[0];
                    com.mnemonicstudios.novusapp.n.a[3] = a[0];
                    com.mnemonicstudios.novusapp.n.b[3] = b[0];
                    com.mnemonicstudios.novusapp.n.c[3] = c[0];
                    com.mnemonicstudios.novusapp.n.d[3] = d[0];
                    com.mnemonicstudios.novusapp.n.e[3] = e[0];
                    com.mnemonicstudios.novusapp.n.f[3] = f[0];
                    com.mnemonicstudios.novusapp.n.g[3] = g[0];
                    com.mnemonicstudios.novusapp.n.i[3] = i[0];
                    com.mnemonicstudios.novusapp.n.k[3] = k[0];
                    com.mnemonicstudios.novusapp.n.l[3] = l[0];
                    com.mnemonicstudios.novusapp.n.m[3] = m[0];
                    com.mnemonicstudios.novusapp.n.o[3] = o[0];
                    com.mnemonicstudios.novusapp.n.p[3] = p[0];
                    com.mnemonicstudios.novusapp.n.q[3] = q[0];
                    com.mnemonicstudios.novusapp.n.r[3] = r[0];
                    break;
                }
                case 12: {
                    com.mnemonicstudios.novusapp.n.a[1] = a.a("worms_rockworm_move_X18Y19.png", 18, 19);
                    com.mnemonicstudios.novusapp.n.b[1] = a.a("worms_rockworm_bighit_XY25.png", 25, 25);
                    break;
                }
                case 13: {
                    com.mnemonicstudios.novusapp.n.c[1] = a.a("worms_rockworm_jump_X11Y25.png", 11, 25);
                    com.mnemonicstudios.novusapp.n.d[1] = a.a("worms_rockworm_death_X19Y24.png", 19, 24);
                    break;
                }
                case 14: {
                    com.mnemonicstudios.novusapp.n.e[1] = a.a("worms_rockworm_rocketaim_X18Y20.png", 18, 20);
                    com.mnemonicstudios.novusapp.n.f[1] = a.a("worms_rockworm_win_X17Y32.png", 17, 32);
                    break;
                }
                case 15: {
                    com.mnemonicstudios.novusapp.n.g[1] = a.a("worms_timefrag_rockworm.png", 15, 19);
                    com.mnemonicstudios.novusapp.n.i[1] = a.a("worms_clusterfrag_rockworm.png", 19, 21);
                    break;
                }
                case 16: {
                    com.mnemonicstudios.novusapp.n.k[1] = a.a("worms_robosheep_rockworm.png", 18, 21);
                    com.mnemonicstudios.novusapp.n.l[1] = a.a("worms_rockworm_teleport_XY2.png", 21, 21);
                    break;
                }
                case 17: {
                    com.mnemonicstudios.novusapp.n.m[1] = a.a("worms_rockworm_backflip_XY25.png", 25, 25);
                    com.mnemonicstudios.novusapp.n.o[1] = a.a("worms_rockworm_laserrifle_X22Y19.png", 22, 19);
                    break;
                }
                case 18: {
                    com.mnemonicstudios.novusapp.n.p[1] = a.a("worms_rockworm_jetpack_X16Y25.png", 16, 25);
                    com.mnemonicstudios.novusapp.n.q[1] = a.a("worms_astropunch_rockworm.png", 17, 19);
                    break;
                }
                case 19: {
                    com.mnemonicstudios.novusapp.n.r[1] = a.a("worms_excavator_rockworm.png", 23, 24);
                    break;
                }
                case 20: {
                    com.mnemonicstudios.novusapp.n.a[2] = a.a("worms_cestoda_move_X19Y23.png", 19, 23);
                    com.mnemonicstudios.novusapp.n.b[2] = a.a("worms_cestoda_bighit_XY29.png", 29, 29);
                    break;
                }
                case 21: {
                    com.mnemonicstudios.novusapp.n.c[2] = a.a("worms_cestoda_jump_X13Y29.png", 13, 29);
                    com.mnemonicstudios.novusapp.n.d[2] = a.a("worms_cestoda_death_X21Y29.png", 21, 29);
                    break;
                }
                case 22: {
                    com.mnemonicstudios.novusapp.n.e[2] = a.a("worms_cestoda_rocketaim_X22Y23.png", 22, 23);
                    com.mnemonicstudios.novusapp.n.f[2] = a.a("worms_cestoda_win_X17Y35.png", 17, 35);
                    break;
                }
                case 23: {
                    com.mnemonicstudios.novusapp.n.g[2] = a.a("worms_timefrag_cestoda.png", 14, 23);
                    com.mnemonicstudios.novusapp.n.i[2] = a.a("worms_clusterfrag_cestoda.png", 18, 23);
                    break;
                }
                case 24: {
                    com.mnemonicstudios.novusapp.n.k[2] = a.a("worms_robosheep_cestoda.png", 17, 23);
                    com.mnemonicstudios.novusapp.n.l[2] = a.a("worms_cestoda_teleport_X22Y24.png", 22, 24);
                    break;
                }
                case 25: {
                    com.mnemonicstudios.novusapp.n.m[2] = a.a("worms_cestoda_backflip_XY32.png", 32, 32);
                    com.mnemonicstudios.novusapp.n.o[2] = a.a("worms_cestoda_laserrifle_XY23.png", 23, 23);
                    break;
                }
                case 26: {
                    com.mnemonicstudios.novusapp.n.p[2] = a.a("worms_cestoda_jetpack_X16Y29.png", 16, 29);
                    com.mnemonicstudios.novusapp.n.q[2] = a.a("worms_astropunch_cestoda.png", 19, 23);
                    break;
                }
                case 27: {
                    com.mnemonicstudios.novusapp.n.r[2] = a.a("worms_excavator_cestoda.png", 25, 26);
                    break;
                }
                case 28: {
                    com.mnemonicstudios.novusapp.n.a[3] = a.a("worms_W800_move_X17Y21.png", 17, 21);
                    com.mnemonicstudios.novusapp.n.b[3] = a.a("worms_W800_bighit_XY26.png", 26, 26);
                    break;
                }
                case 29: {
                    com.mnemonicstudios.novusapp.n.c[3] = a.a("worms_W800_jump_X10Y27.png", 10, 27);
                    com.mnemonicstudios.novusapp.n.d[3] = a.a("worms_W800_death_X19Y26.png", 19, 26);
                    break;
                }
                case 30: {
                    com.mnemonicstudios.novusapp.n.e[3] = a.a("worms_W800_rocketaim_X18Y21.png", 18, 21);
                    com.mnemonicstudios.novusapp.n.f[3] = a.a("worms_W800_win_X17Y34.png", 17, 34);
                    break;
                }
                case 31: {
                    com.mnemonicstudios.novusapp.n.g[3] = a.a("worms_timefrag_W800.png", 14, 21);
                    com.mnemonicstudios.novusapp.n.i[3] = a.a("worms_clusterfrag_W800.png", 18, 21);
                    break;
                }
                case 32: {
                    com.mnemonicstudios.novusapp.n.k[3] = a.a("worms_robosheep_W800.png", 17, 21);
                    com.mnemonicstudios.novusapp.n.l[3] = a.a("worms_W800_teleport_XY21.png", 21, 21);
                    break;
                }
                case 33: {
                    com.mnemonicstudios.novusapp.n.m[3] = a.a("worms_W800_backflip_XY27.png", 27, 27);
                    com.mnemonicstudios.novusapp.n.o[3] = a.a("worms_W800_laserrifle_X22Y21.png", 22, 21);
                    break;
                }
                case 34: {
                    com.mnemonicstudios.novusapp.n.p[3] = a.a("worms_W800_jetpack_X16Y27.png", 16, 27);
                    com.mnemonicstudios.novusapp.n.q[3] = a.a("worms_astropunch_W800.png", 17, 21);
                    break;
                }
                case 35: {
                    com.mnemonicstudios.novusapp.n.r[3] = a.a("worms_excavator_W800.png", 23, 24);
                    break;
                }
                case 36: {
                    l = a.a("worms_impactfrag_frames.png", 12, 12);
                    break;
                }
                case 37: {
                    j = a.a("sf_rip.png", 14, 20);
                    break;
                }
                case 38: {
                    k = a.a("worm_largeexplosion_X57Y63.png", 57, 63);
                    break;
                }
                case 39: {
                    m = a.a("worm_rocketflame_XY09.png", 9, 9);
                    break;
                }
                case 40: {
                    w = a.a("worms_saucer_X40Y32.png", 40, 32);
                    break;
                }
                case 41: {
                    x = a.a("worms_wiiiconstrip24px.png", 24, 24);
                    break;
                }
                case 42: {
                    n = a.a("worms_timefrag_frames.png", 14, 14);
                    break;
                }
                case 43: {
                    break;
                }
                case 44: {
                    p = a.a("worms_proxmineoff_XY11.png", 11, 11);
                    break;
                }
                case 45: {
                    r = a.a("worms_clusterfrag_frames.png", 15, 15);
                    break;
                }
                case 46: {
                    s = a.a("worms_bananasmall_XY13.png", 13, 13);
                    break;
                }
                case 47: {
                    try {
                        com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape2_backdrop.png");
                        com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
                        com.mnemonicstudios.novusapp.n.a.c = Image.createImage((String)"/worms_landscape2cap.png");
                    }
                    catch (Exception exception) {
                        Exception exception2 = exception;
                        exception.printStackTrace();
                    }
                    break;
                }
                case 48: {
                    break;
                }
                case 49: {
                    try {
                        com.mnemonicstudios.novusapp.n.a.f = Image.createImage((String)"/worms_waterFG02_X64Y16.png");
                        com.mnemonicstudios.novusapp.n.a.b = new Sprite(com.mnemonicstudios.novusapp.n.a.f, com.mnemonicstudios.novusapp.n.a.f.getWidth(), com.mnemonicstudios.novusapp.n.a.f.getHeight());
                    }
                    catch (Exception exception) {
                        Exception exception3 = exception;
                        exception.printStackTrace();
                    }
                    break;
                }
                case 50: {
                    try {
                        com.mnemonicstudios.novusapp.n.a.g = Image.createImage((String)"/worms_waterBG02_X64Y16.png");
                        new Sprite(com.mnemonicstudios.novusapp.n.a.g, com.mnemonicstudios.novusapp.n.a.g.getWidth(), com.mnemonicstudios.novusapp.n.a.g.getHeight());
                    }
                    catch (Exception exception) {
                        Exception exception4 = exception;
                        exception.printStackTrace();
                    }
                    break;
                }
                case 51: {
                    com.mnemonicstudios.novusapp.j.q();
                    break;
                }
                case 52: {
                    a.a(1, "landscape1_tile.png");
                    a.a(2, "worms_landscape06_obj01.png");
                    a.a(3, "landscape3_object1.png");
                    break;
                }
                case 53: {
                    a.a(4, "landscape2_tile.png");
                    a.a(5, "worms_moon_object01.png");
                    a.a(6, "worms_moon_object02.png");
                    break;
                }
                case 54: {
                    a.a(7, "landscape3_tile.png");
                    a.a(8, "landscape3_object1.png");
                    a.a(9, "landscape3_object2.png");
                    break;
                }
                case 55: {
                    a.a(10, "landscape4_tile.png");
                    a.a(11, "worms_moon_object01.png");
                    a.a(12, "worms_moon_object02.png");
                    break;
                }
                case 56: {
                    a.a(13, "landscape5_tile.png");
                    a.a(14, "worms_moon_object01.png");
                    a.a(15, "worms_moon_object02.png");
                    break;
                }
                case 57: {
                    M = a.a("worms_fortress00.png", 28, 40);
                    break;
                }
                case 58: {
                    N = a.a("worms_shieldgen00.png", 24, 32);
                    break;
                }
                case 60: {
                    q = a.a("worms_proxmineon_XY11.png", 11, 11);
                    break;
                }
                case 61: {
                    y = a.a("worms_thoughtballoon_X32Y30.png", 32, 30);
                    break;
                }
                case 62: {
                    z = a.a("worms_thoughticons_X13Y16.png", 13, 16);
                    break;
                }
                case 63: {
                    A = a.a("worms_crate_X26Y22.png", 26, 22);
                    break;
                }
                case 64: {
                    break;
                }
                case 65: {
                    break;
                }
                case 66: {
                    C = a.a("worms_oildrum_X22Y24.png", 22, 24);
                    break;
                }
                case 67: {
                    D = a.a("worms_dropcrate_frames.png", 54, 44);
                    break;
                }
                case 68: {
                    E = a.a("worms_health_X26Y22.png", 26, 22);
                    break;
                }
                case 69: {
                    y = a.a("worms_thoughtballoon_X32Y30.png", 32, 30);
                    break;
                }
                case 70: {
                    z = a.a("worms_thoughticons_X13Y16.png", 13, 16);
                    break;
                }
                case 71: {
                    com.mnemonicstudios.novusapp.n.a[0][0] = a.a("worms_landscape1particle_2px.png", 2, 2);
                    com.mnemonicstudios.novusapp.n.a[0][1] = a.a("worms_landscape1particle_4px.png", 4, 4);
                    com.mnemonicstudios.novusapp.n.a[0][2] = a.a("worms_landscape1particle_6px.png", 6, 6);
                    com.mnemonicstudios.novusapp.n.a[0][3] = a.a("worms_landscape1particle_8px.png", 8, 8);
                    break;
                }
                case 72: {
                    com.mnemonicstudios.novusapp.n.a[1][0] = a.a("worms_landscape2particle_2px.png", 2, 2);
                    com.mnemonicstudios.novusapp.n.a[1][1] = a.a("worms_landscape2particle_4px.png", 4, 4);
                    com.mnemonicstudios.novusapp.n.a[1][2] = a.a("worms_landscape2particle_6px.png", 6, 6);
                    com.mnemonicstudios.novusapp.n.a[1][3] = a.a("worms_landscape2particle_8px.png", 8, 8);
                    break;
                }
                case 73: {
                    com.mnemonicstudios.novusapp.n.a[2][0] = a.a("worms_landscape3particle_2px.png", 2, 2);
                    com.mnemonicstudios.novusapp.n.a[2][1] = a.a("worms_landscape3particle_4px.png", 4, 4);
                    com.mnemonicstudios.novusapp.n.a[2][2] = a.a("worms_landscape3particle_6px.png", 6, 6);
                    com.mnemonicstudios.novusapp.n.a[2][3] = a.a("worms_landscape3particle_8px.png", 8, 8);
                    break;
                }
                case 74: {
                    com.mnemonicstudios.novusapp.n.a[3][0] = a.a("worms_landscape4particle_2px.png", 2, 2);
                    com.mnemonicstudios.novusapp.n.a[3][1] = a.a("worms_landscape4particle_4px.png", 4, 4);
                    com.mnemonicstudios.novusapp.n.a[3][2] = a.a("worms_landscape4particle_6px.png", 6, 6);
                    com.mnemonicstudios.novusapp.n.a[3][3] = a.a("worms_landscape4particle_8px.png", 8, 8);
                    break;
                }
                case 75: {
                    com.mnemonicstudios.novusapp.n.a[4][0] = a[2][0];
                    com.mnemonicstudios.novusapp.n.a[4][1] = a[2][1];
                    com.mnemonicstudios.novusapp.n.a[4][2] = a[2][2];
                    com.mnemonicstudios.novusapp.n.a[4][3] = a[2][3];
                    break;
                }
                case 76: {
                    v = a.a("worms_atompack_frames.png", 11, 16);
                    break;
                }
                case 77: {
                    u = a.a("worms_robosheep_frames.png", 18, 18);
                    break;
                }
                case 78: {
                    F = a.a("worms_gamefont_green.png", 12, 12);
                    G = a.a("worms_gamefont_red.png", 12, 12);
                    I = a.a("worms_gamefont_cyan.png", 12, 12);
                    H = a.a("worms_gamefont_yellow.png", 12, 12);
                    J = a.a("worms_gamefont.png", 12, 12);
                    break;
                }
                case 79: {
                    a.a(com.mnemonicstudios.novusapp.o.a);
                    break;
                }
                case 80: {
                    K = a.a("worms_annelcrystal_X18Y21.png", 18, 21);
                    break;
                }
                case 81: {
                    L = a.a("worms_saucerplatform_XY32.png", 32, 32);
                    break;
                }
                case 82: {
                    O = a.a("worms_airstrike_missile.png", 11, 13);
                    break;
                }
                case 83: {
                    com.mnemonicstudios.novusapp.n.a.a = Image.createImage((String)"/worms_girderH_X32Y08.png");
                    break;
                }
                case 88: {
                    Q = a.a("worms_numberstrip_big.png", 18, 18);
                    break;
                }
                case 89: {
                    break;
                }
                case 90: {
                    R = a.a("worms_surrenderflag_X54Y27.png", 54, 27);
                }
            }
            ++this.S;
            return this.S >= this.T;
        }
        catch (Exception exception) {
            return false;
        }
    }

    public static final void b() {
        try {
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/jump.wav");
            com.mnemonicstudios.novusapp.n.a[0] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/explosion.wav");
            com.mnemonicstudios.novusapp.n.a[1] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/bip.wav");
            com.mnemonicstudios.novusapp.n.a[2] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/sheep.wav");
            com.mnemonicstudios.novusapp.n.a[3] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/drown.wav");
            com.mnemonicstudios.novusapp.n.a[4] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/crate.wav");
            com.mnemonicstudios.novusapp.n.a[5] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/missile.wav");
            com.mnemonicstudios.novusapp.n.a[6] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/teleport.wav");
            com.mnemonicstudios.novusapp.n.a[7] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/punch.wav");
            com.mnemonicstudios.novusapp.n.a[8] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/ow.wav");
            com.mnemonicstudios.novusapp.n.a[9] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/shield.wav");
            com.mnemonicstudios.novusapp.n.a[10] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
            a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/atompack.wav");
            com.mnemonicstudios.novusapp.n.a[11] = Manager.createPlayer((InputStream)a, (String)"audio/x-wav");
        }
        catch (MediaException mediaException) {
        }
        catch (IOException iOException) {}
        try {
            if (a == null) {
                a = ((Object)((Object)NovusMidlet.a)).getClass().getResourceAsStream("/theme.mid");
                a = Manager.createPlayer((InputStream)a, (String)"audio/midi");
                a.realize();
                a.prefetch();
                a.setLoopCount(-1);
            }
            return;
        }
        catch (MediaException mediaException) {
            return;
        }
        catch (IOException iOException) {
            return;
        }
    }

    public static final void c() {
        if (!com.mnemonicstudios.novusapp.o.l) {
            com.mnemonicstudios.novusapp.n.d();
            return;
        }
        try {
            if (a != null) {
                a.start();
            }
            return;
        }
        catch (MediaException mediaException) {
            return;
        }
    }

    public static final void d() {
        try {
            if (a != null) {
                a.stop();
            }
            return;
        }
        catch (MediaException mediaException) {
            return;
        }
    }

    public static final void a(int n2) {
        if (!com.mnemonicstudios.novusapp.o.m || n2 < 0) {
            return;
        }
        try {
            if (n2 != U || System.currentTimeMillis() - b > 600L) {
                if (a[U] != null) {
                    a[U].stop();
                }
                if (a[n2] != null) {
                    a[n2].start();
                    U = n2;
                    b = System.currentTimeMillis();
                }
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    static {
        a = new b();
        a = new j();
        a = new k();
        a = new e();
        a = new d();
        b = 5;
        a = new i();
        a = new o();
        a = new r();
        a = new g();
        a = new p();
        a = new m[4];
        a = new q();
        f = false;
        d = -1;
        g = false;
        h = false;
        a = Font.getFont((int)0, (int)1, (int)8);
        a = new Random(System.currentTimeMillis() | 0xFACE0FFL);
        b = Font.getFont((int)64, (int)0, (int)8);
        b = new int[][]{{-1, -1}, {1, -1}, {-1, 1}, {1, 1}, {0, -1}, {0, 1}, {-1, 0}, {1, 0}};
        a = new int[8];
        b = new int[8];
        c = new int[8];
        d = new int[8];
        e = new int[8];
        f = new int[8];
        g = new int[8];
        h = new int[8];
        i = new int[8];
        j = new int[8];
        k = new int[8];
        l = new int[8];
        m = new int[8];
        n = new int[8];
        o = new int[8];
        p = new int[8];
        q = new int[8];
        r = new int[8];
        a = new int[5][4];
        a = new s();
        a = new String[0];
        b = new String[0];
        c = new String[0];
        a = new Player[12];
    }
}


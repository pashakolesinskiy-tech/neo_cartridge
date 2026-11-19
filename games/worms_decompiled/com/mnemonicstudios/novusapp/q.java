/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.NovusMidlet;
import com.mnemonicstudios.novusapp.n;
import com.mnemonicstudios.novusapp.o;
import com.mnemonicstudios.novusapp.p;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class q {
    static Image a;
    static int a;
    public static String a;
    static boolean a;
    static int b;

    public static final void a() {
        try {
            a = Image.createImage((String)"/thq-logo_gmgw.png");
        }
        catch (Exception exception) {}
        a = 1;
        q.c();
        try {
            NovusMidlet.a.getAppProperty("GMG_Property_1");
        }
        catch (Exception exception) {}
        try {
            NovusMidlet.a.getAppProperty("GMG_Property_2");
        }
        catch (Exception exception) {}
        try {
            NovusMidlet.a.getAppProperty("GMG_Property_3");
        }
        catch (Exception exception) {}
        try {
            a = NovusMidlet.a.getAppProperty("GMG_Property_4");
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private static void c() {
        p.a(2, 232, 236, 44);
        p.a(143, 0);
    }

    public static final void b() {
        a = true;
        p.a(2, 56, 236, 264);
        p.a(143, 0);
        if (a) {
            if (n.d()) {
                o.a = false;
            }
            if (n.c()) {
                try {
                    NovusMidlet.a.platformRequest(a);
                    n.e = false;
                    return;
                }
                catch (Exception exception) {
                    Exception exception2 = exception;
                    exception.printStackTrace();
                }
            }
        }
    }

    public static final void a(Graphics graphics) {
        graphics.setColor(0);
        graphics.fillRect(0, 0, 240, 320);
        graphics.setColor(255, 255, 255);
        graphics.fillRect(0, 0, 240, 32);
        graphics.drawImage(a, 120 - (a.getWidth() >> 1), 2, 20);
        ++b;
        b &= 0x1FF;
        if (a && a == 4) {
            p.b(graphics);
        }
        try {
            if (a != 4 && a) {
                p.b(graphics);
            }
        }
        catch (Exception exception) {}
        n.a.a(graphics, 2, 0);
    }

    static {
        a = 1;
        a = false;
    }
}


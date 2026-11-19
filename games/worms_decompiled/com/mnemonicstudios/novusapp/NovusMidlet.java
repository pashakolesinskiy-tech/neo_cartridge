/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Display
 *  javax.microedition.lcdui.Displayable
 *  javax.microedition.midlet.MIDlet
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.n;
import javax.microedition.lcdui.Display;
import javax.microedition.lcdui.Displayable;
import javax.microedition.midlet.MIDlet;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public class NovusMidlet
extends MIDlet {
    public static NovusMidlet a;
    public static n a;
    public static Display a;
    public static String a;

    public final void startApp() {
        if (a == null) {
            a = this.getAppProperty("MIDlet-Version");
            a = a == null ? "V?.??" : "V" + a;
            a = this;
            a = new n();
            a = Display.getDisplay((MIDlet)this);
            a.setCurrent((Displayable)a);
            a.setFullScreenMode(true);
            a.a();
        }
    }

    public final void pauseApp() {
        n.h = true;
    }

    public final void destroyApp(boolean bl) {
        try {
            a = null;
            n.a = null;
            a = null;
            a = null;
            System.gc();
        }
        catch (Exception exception) {}
        this.notifyDestroyed();
    }

    public final void a() {
        this.destroyApp(true);
    }
}


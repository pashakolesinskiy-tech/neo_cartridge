/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Font
 *  javax.microedition.lcdui.Graphics
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;
import java.io.DataInputStream;
import java.io.InputStream;
import javax.microedition.lcdui.Font;
import javax.microedition.lcdui.Graphics;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class s {
    public static Font a = Font.getFont((int)0, (int)0, (int)0);
    public static int[] a = new int[]{8, 3, 7, 7, 3, 3, 4, 3, 6, 8, 10, 10, 10, 10, 10, 10, 10, 11, 7, 9, 10, 11, 12, 10, 11, 10, 10, 10, 10, 10, 10, 10, 12, 10, 10, 10, 10, 8, 8, 8, 9, 8, 10, 8, 5, 6, 8, 5, 13, 8, 8, 8, 8, 8, 8, 5, 8, 8, 12, 8, 8, 8, 3, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 6, 6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 6, 8, 5, 10, 5, 10, 10, 10, 10, 10, 10, 10, 10, 8, 10, 10, 12, 0, 0};
    public static int a = 12;
    int b;
    String[] a;
    String[] b;
    int c = 0;
    int d = 0;
    boolean a;
    int e;
    int f;
    int g;
    int h;
    boolean b = false;
    int i;
    int j;
    int k;
    int l;
    int m;
    int n;
    int o;
    byte[] a;
    short[] a = false;

    public s() {
        this.b = new String[]{"english.mbgt", "french.mbgt", "italian.mbgt", "german.mbgt", "spanish.mbgt"};
    }

    public final void a(int n2) {
        this.b = n2;
        this.a(this.a[this.b]);
        this.b(this.b[this.b]);
    }

    public final void a() {
        this.d = 32768 + com.mnemonicstudios.novusapp.j.i[this.c & 0xFFF];
        this.c += 128;
        this.c &= 0xFFF;
    }

    public final int a() {
        if (!this.a) {
            return 0;
        }
        return this.d;
    }

    public final void a(Graphics graphics, int n2, int n3, int n4, int n5, int n6) {
        this.a = true;
        this.b(graphics, n2, n3, n4, n5, n6);
        this.a();
        this.a = false;
    }

    public final void b(Graphics graphics, int n2, int n3, int n4, int n5, int n6) {
        this.f = 0;
        this.e = 0;
        if ((n5 & 2) != 0) {
            this.f = a >> 1;
        }
        if ((n5 & 1) != 0) {
            this.e = -(this.a(n2) >> 1);
        }
        if ((n5 & 8) != 0) {
            this.e = -this.a(n2);
        }
        if ((n5 & 0x20) != 0) {
            this.f = -a;
        }
        this.a(graphics, n2, n3 + 2 + this.e, n4 + 2 + this.f, com.mnemonicstudios.novusapp.n.J);
        this.a(graphics, n2, n3 + this.e, n4 + this.f, n6);
    }

    public final int a(int n2) {
        this.l = this.a[n2];
        this.g = 0;
        try {
            while (this.a[this.l] > 0) {
                this.m = (a[this.a[this.l]] << 16) + this.a();
                this.g += this.m;
                ++this.l;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        return this.g >> 16;
    }

    public final int a(int n2, int n3, int n4) {
        this.b = false;
        this.l = this.a[n2] + n3;
        this.g = 0;
        this.h = n3;
        try {
            while (this.a[this.l] > 0 && this.g < n4 << 16) {
                if (a[this.a[this.l]] << 16 == 0) {
                    return this.l - this.a[n2];
                }
                this.m = (a[this.a[this.l]] << 16) + this.a();
                if (this.a[this.l] == 109) {
                    this.h = this.l - this.a[n2];
                }
                this.g += this.m;
                ++this.l;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        if (this.a[this.l] <= 0 && this.g >> 16 <= n4) {
            this.b = true;
            this.h = this.l - this.a[n2];
        }
        return this.h;
    }

    public final boolean a(Graphics graphics, int n2, int n3, int n4, int n5, int n6, int n7, int n8, int n9, int n10) {
        this.b = false;
        this.i = 0;
        this.j = 0;
        this.k = n4 + n7 + n10;
        while (!this.b) {
            this.j = this.a(n2, this.i, n5);
            graphics.setClip(n3, n4, n5, n6);
            this.a(graphics, n2, this.i, this.j, n3 + 2, this.k + 2, com.mnemonicstudios.novusapp.n.J, n9);
            this.a(graphics, n2, this.i, this.j, n3, this.k, n8, n9);
            this.k += n7;
            this.i = this.j + 1;
        }
        graphics.setClip(0, 0, 240, 320);
        return n6 >= this.k;
    }

    public final void a(Graphics graphics, int n2, int n3, int n4, int n5, int n6, int n7, int n8) {
        this.l = this.a[n2] + n3;
        n4 += this.a[n2];
        n5 <<= 16;
        try {
            while (this.a[this.l] > 0 && this.l <= n4) {
                this.m = (a[this.a[this.l]] << 16) + this.a();
                com.mnemonicstudios.novusapp.n.a.a(graphics, n7, n5 + (this.m >> 1) >> 16, n6, (int)this.a[this.l], 0);
                n5 += this.m;
                ++this.l;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void a(Graphics graphics, int n2, int n3, int n4, int n5) {
        this.l = this.a[n2];
        n3 <<= 16;
        try {
            while (this.a[this.l] >= 0) {
                this.m = (a[this.a[this.l]] << 16) + this.a();
                switch (com.mnemonicstudios.novusapp.j.c) {
                    case 0: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, n5, n3 + (this.m >> 1) >> 16, n4, (int)this.a[this.l], 0);
                        break;
                    }
                    case 1: 
                    case 2: {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, n5, 240 - n4, n3 + (this.m >> 1) >> 16, (int)this.a[this.l], 0);
                    }
                }
                n3 += this.m;
                ++this.l;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void b(Graphics graphics, int n2, int n3, int n4, int n5) {
        try {
            switch (com.mnemonicstudios.novusapp.j.c) {
                case 0: {
                    com.mnemonicstudios.novusapp.n.a.a(graphics, n5, n3, n4, 112 + n2, 0);
                    break;
                }
                case 2: {
                    com.mnemonicstudios.novusapp.n.a.a(graphics, n5, 240 - n4 + 16, n3, 112 + n2, 0, 5);
                    break;
                }
                case 1: {
                    com.mnemonicstudios.novusapp.n.a.a(graphics, n5, n4, n3, 112 + n2, 0, 6);
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

    private void a(String string) {
        try {
            InputStream inputStream = this.getClass().getResourceAsStream("/" + string);
            DataInputStream dataInputStream = new DataInputStream(inputStream);
            this.o = dataInputStream.readShort();
            this.a = new byte[this.o];
            this.n = 0;
            while (this.n < this.o) {
                this.a[this.n] = dataInputStream.readByte();
                ++this.n;
            }
            dataInputStream.close();
            inputStream.close();
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    private void b(String string) {
        try {
            InputStream inputStream = this.getClass().getResourceAsStream("/" + string);
            DataInputStream dataInputStream = new DataInputStream(inputStream);
            this.o = dataInputStream.readShort();
            this.a = new short[this.o];
            this.n = 0;
            while (this.n < this.o) {
                this.a[this.n] = dataInputStream.readShort();
                ++this.n;
            }
            dataInputStream.close();
            inputStream.close();
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }
}


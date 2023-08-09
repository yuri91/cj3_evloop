public class EventLoop {
	Object pending = null;
	public Object getPending() {
		return pending;
	}
	void start() {
		Thread t = new Thread(new Runnable() {
			@Override
			public void run() {
				eventLoop();
			}
		});
		t.start();
	}
	void eventLoop() {
		while(true) {
			Runnable r = waitForEvent(this);
			r.run();
		}
	}
	public void addEvent(Object p, Runnable r) {
		addEventNative(this, p, r);
	}
	public EventLoop() {
		pending = init(this);
		start();
	}
	static native Object init(EventLoop self);
	static native Runnable waitForEvent(EventLoop self);
	static native void addEventNative(EventLoop self, Object p, Runnable r);
}

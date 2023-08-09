public class Main {
	static EventLoop e = new EventLoop();
	public static void sleep(double ms, Runnable r) {
		Object p = sleepNative(ms);
		e.addEvent(p, r);
	}
	static native Object sleepNative(double ms);


	public static void main(String[] args) {
		System.out.println("start");
		sleep(1000, new  Runnable() {
			@Override
			public void run() {
				System.out.println("hello event loop 1");
			}
		});
		sleep(1500, new  Runnable() {
			@Override
			public void run() {
				System.out.println("hello event loop 2");
			}
		});
	}
}

function createPromise() {
	let fulfill = null;
	let reject = null;
	let p = new Promise((f, r) => {
		fulfill = f;
		reject = r;
	});
	return {
		fulfill,
		reject,
		p,
	};

}
function newWaker() {
	let p = createPromise();
	p.p = p.p.then(() => {
		return -1;
	});
	return p;
}
async function  Java_EventLoop_init(lib, self) {
	return {
		queue: [],
		waker: newWaker(),
	};
}

async function  Java_EventLoop_waitForEvent(lib, self) {
	self = lib.getObjectWrapper(self);
	let pending = (await self.getPending()).unwrap();
	while(true) {
		let all = [pending.waker.p];
		for(let [i, ev] of pending.queue.entries()) {
			all.push(ev.p.p.then(() => {
				return i;
			}));
		}
		let resolved = await Promise.race(all);
		pending.waker = newWaker();
		if(resolved >= 0) {
			return pending.queue.splice(resolved, 1)[0].r;
		}
	}
}

async function Java_EventLoop_addEventNative(lib, self, p, r) {
	self = lib.getObjectWrapper(self);
	let pending = (await self.getPending()).unwrap();
	pending.queue.push({p, r});
	pending.waker.fulfill();
}

async function Java_Main_sleepNative(lib, ms) {
	let p = createPromise();
	setTimeout(() => {
		p.fulfill();
	}, ms);
	return p;
}

let natives = {
	Java_EventLoop_init,
	Java_EventLoop_waitForEvent,
	Java_EventLoop_addEventNative,
	Java_Main_sleepNative,
};

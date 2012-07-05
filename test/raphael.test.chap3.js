moduleOnRaphael('애니메이션');

testWithBlock('애니메이션 적용하기', function (paper, block) {
	// @param {Object} attribute 변경할 속성
	// @param {number} ms 애니메이팅 시간
	// @param {string} easing 이징 타입 linear | ease-in | ease-out | ease-in-out |
	//									back-in | back-out | elastic | bounce
	block.animate({
		'fill': 'orange'
	}, 1000, 'ease-out');
});

testWithBlock('bounce 효과 적용하기', function (paper, block) {
	// @see http://raphaeljs.com/easing.html 이징 데모 페이지
	block.animate({
		'transform': 't0,80'
	}, 1500, 'bounce');
});

testWithBlock('elastic 효과 적용하기', function (paper, block) {
	block.animate({
		'transform': 's1.3'
	}, 1000, 'elastic', function () {
		// 애니메이션 종료 후 콜백을 실행할 수 있다.
		log('animating done');
	});
});

testWithBlock('그래디언트를 애니메이션으로 적용하기', function (paper, block) {
	block.animate({
		'fill': '0-orange-red-purple'
	}, 1000, 'ease-in'); // 그래디언트에는 애니메이션을 적용할 수 없다.
});

testWithBlock('애니메이션 객체를 사용해서 적용하기', function (paper, block) {
	// 애니메이션 객체를 정의해 적용할 수도 있다.
	var anim = Raphael.animation({
		'fill': 'orange'
	}, 1000, 'ease-in');
	
	block.animate(anim);
});

testWithBlock('여러 개의 엘리먼트를 동시에 애니메이팅하기', function (paper, block) {
	// 블럭을 애니메이팅한다.
	var anim = Raphael.animation({
		'transform': 't0,80'
	}, 1200, 'bounce');
	block.animate(anim);
	
	// 원을 여러 개 생성해 애니메이팅한다.
	for (var i = 0; i < 500; i++) {
		paper
			.circle(40, 40, 20)
			.animate({
				'transform': 't0,140'
			}, 2000, 'bounce');
	}
	
	// 동시에 애니메이팅을 하는 것이지만,
	// 시작 시점이 달라 잔상처럼 보이는 것을 확인할 수 있다.
	// 애니메이션마다 각각의 타이머를 생성하기 때문이다.
});

testWithBlock('여러 개의 엘리먼트 애니메이팅 타이밍 맞추기', function (paper, block) {
	// @see http://dmitry.baranovskiy.com/post/raphael-1-2-1
	var anim = Raphael.animation({
		'transform': 't0,80'
	}, 1200, 'bounce');
	block.animate(anim);
	
	for (var i = 0; i < 500; i++) {
		paper
			.circle(40, 40, 20)
			// 타이밍을 맞추기 위해 animateWith()를 사용한다.
			.animateWith(block, anim, {
				'transform': 't0,140'
			}, 2000, 'bounce');
	}
	
	// animateWith()를 사용하면 첫 번째 파라미터로 전달된 엘리먼트의 타이머를 이용한다.
	// 많은 엘리먼트를 애니메이팅하는 경우, animateWith()로 싱크 문제를 해결할 수 있다.
});

testWithBlock('애니메이션 키프레임 처리하기', function (paper, block) {
	block.animate({
		'0%': { 'fill': 'blue' },
		'30%': { 'fill': 'red' },
		'100%': { 'fill': 'orange' }
	}, 2000); // css3에서 애니메이션 키프레임을 설정하는 것처럼 타이밍을 조절할 수 있다. 
});
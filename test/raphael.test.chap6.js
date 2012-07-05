moduleOnRaphael('매트릭스 트랜스폼 활용하기');

testWithBlock('매트릭스 사용해 이동하기', function (paper, block) {
	// 라파엘의 행렬은 Raphael.matrix(a,b,c,d,e,f) 또는
	// 매트릭스 문자열 'm'과, 'a,b,c,d,e,f' 값을 연속으로 나열한 문자열로 표현할 수 있다.
	// 
	// translate을 적용하기 위한 여섯 개의 파라미터를 행렬로 표현하면 아래 모습과 같다.
	//   ( a, b, e )
	//   ( c, d, f )
	//   ( 0, 0, 1 )  // 각 파라미터의 순서를 유심히 본다.
	
	// (x,y)를 (x + tx, x + ty)로 transform 하기 위한 행렬은 아래와 같다.
	//   ( 1, 0,tx ) (x) = (1x + tx)
	//   ( 0, 1,ty ) (y) = (1y + ty) 
	//   ( 0, 0, 1 ) (1) = (   1   ) 
	block
		.clone()
		.transform('m1,0,0,1,50,50') // 50, 50 픽셀 이동한다.
		.attr({
			'stroke': 'red'
		});
	
	// SVG Matrix에 대한 정보는 아래 참고한다.
	// http://www.mecxpert.de/svg/transform.html
});

testWithBlock('매트릭스를 사용해 크기 변경하기', function (paper, block) {
	// scale을 적용하기 위한 행렬 계산식은 아래와 같다.
	//  ( sx,0, 0 ) (x) = (sx * x)
	//  ( 0, sy,0 ) (y) = (sy * y)
	//  ( 0, 0, 1 ) (1) = (   1  )
	block
		.clone()
		.transform('m,1.3,0,0,1.3,0,0') // 1.3배 크게 한다.
		.attr({
			'stroke': 'red',
			'opacity': 0.7
		});
	// 확대의 기준점이 0,0 인 것에 주의한다.
});

testWithBlock('매트릭스를 사용해 회전하기', function (paper, block) {
	// rotation을 적용하기 위한 행렬 계산식은 아래와 같다.
	//  ( cos(a),-sin(a), 0 ) (x) = (cos(a)*x - sin(a)*y)
	//  ( sin(a),cos(a), 0) (y) = (sin(a)*x + cons(a)*y)
	//  ( 0, 0, 1 ) (1) = (   1  )
	
	var angle = 15,
		radian = Raphael.rad(angle), // 각도를 라디언으로 변경한다
		a = Math.cos(radian),
		b = -Math.sin(radian),
		c = -b,
		d = a,
		e = 0,
		f = 0,
		matrix = Raphael.matrix(a, b, c, d, e, f);
	
	block
		.clone()
		.transform(matrix.toTransformString()) // 원점을 기준으로 15도 회전한다.
		.attr({
			'stroke': 'red'
		});
	// 각도의 값이 양수이면, 회전 방향이 반시계 방향인 것에 주의한다. 
});

testWithBlock('매트릭스를 사용해 제자리에서 회전하기', function (paper, block) {
	// 특정 포인트를 중심으로 회전하기 위해서는,
	// 해당 지점으로 이동해 회전 후 다시 돌아오면 된다.
	var bbBlock = block.getBBox(),
		cxBlock = bbBlock.x + bbBlock.width/2, // 블럭의 중점
		cyBlock = bbBlock.y + bbBlock.height/2;
	
	var matrix = Raphael.matrix(1, 0, 0, 1, cxBlock, cyBlock); // 중점으로 이동하는 매트릭스
	
	var radian = Raphael.rad(30), // 30도 회전을 위한 라디안
		cos = Math.cos(radian),
		sin = Math.sin(radian);
	matrix.add(cos, -sin, sin, cos, 0, 0); // 30도 회전한다.
	// 라파엘에서는 매트릭스의 곱연산을 add() 메서드로 제공한다.
	
	matrix.add(1, 0, 0, 1, -cxBlock, -cyBlock); // 다시 회전 중심점으로 돌아온다.
	
	block
		.clone()
		.transform(matrix.toTransformString())
		.attr({
			'stroke': 'red',
			'opacity': 0.7
		});
});

testWithBlock('매트릭스 객체로 쉽게 변형하기', function (paper, block) {
	// 이전 테스트처럼 직접 매트릭스 수치를 계산하는 방법은 복잡하고 어렵다.
	// Raphael.matrix 객체의 translate(), rotate(), scale() 메서드를 사용하면 쉽게 처리할 수 있다.
	var matrix = Raphael.matrix();
	matrix.translate(50, 50); // 50,50만큼 이동한다.
	matrix.scale(0.7, 0.7, 50, 50); // 그 다음, 스케일을 줄이고
	matrix.rotate(-30, 100, 100); // 30도 회전한다.
	
	block
		.clone()
		.attr('stroke', 'red')
		.transform(matrix.toTransformString()); // 매트릭스 스트링으로 변경해 적용한다.
	
	// Element.translate(), rotate(), scale()은 deprecated이니 사용하지 않도록 한다.
});

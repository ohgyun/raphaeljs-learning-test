moduleOnRaphael('셋과 트랜스폼');

testWithFace('셋과 도형으로 테스트', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	// 각 파라미터가 의미하는 값은 아래와 같다.
	// stHead 머리 set = pFace + stEye + rMouth
	// pFace 얼굴 path
	// stEye 눈 set = cLeftEye + rRightEye
	// rMouth 입 rect
	// cLeftEye 왼쪽눈 circle
	// rRightEye 오른쪽눈 rect
});

testWithFace('셋을 이동하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	// 각 파라미터가 의미하는 값은 아래와 같다.
	// stHead 머리 set = pFace + stEye + rMouth
	// pFace 얼굴 path
	// stEye 눈 set = cLeftEye + rRightEye
	// rMouth 입 rect
	// cLeftEye 왼쪽눈 circle
	// rRightEye 오른쪽눈 rect
	
	stHead.transform('t100,0'); // 전체 셋을 translate 할 수 있다.
});

testWithFace('셋을 회전하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	stHead.transform('r-30');
	// 셋에 포함된 엘리먼트의 회전축이 모두 다르기 때문에 의도한 대로 동작하지 않는다. 
});

testWithFace('셋 회전 시 중심점 잡아주기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	stHead.transform('r-30,100,100');
	// 회전할 때 중심점을 잡아주면 원하는 결과를 얻을 수 있다.
});

testWithFace('상위 셋 이동 후 하위 셋 이동하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	stHead.transform('t100,0');
	stEye.transform('t0,30');
	// 상위 셋 이동 후 하위 셋에 트랜스폼을 적용하면 의도한 대로 동작하지 않는다.
});

testWithFace('상위 셋 이동 후 연속으로 하위 셋 이동하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	stHead.transform('t100,0');
	stEye.transform('...t0,30');
	// 트랜스폼을 이어서 적용하겠다는 "..." 접두사를 붙인다. 
});

testWithFace('하위 셋 이동 후 상위 셋 이동하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	// 양 눈을 모은다.
	cLeftEye.transform('t10,10');
	rRightEye.transform('t-10,10');
	
	stHead.transform('t100, 0');
	// 하위 엘리먼트에 적용한 트랜스폼 값이 초기화된다.
});

testWithFace('하위 셋 이동 후 연속으로 상위 셋 이동하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	// 양 눈을 모은다.
	cLeftEye.transform('t10,10');
	rRightEye.transform('t-10,10');
	
	stHead.transform('...t100, 0');
	// 이전과 마찬가지로, "..." 접두사를 붙이면 된다.
	// 라파엘은 내부적으로 트랜스폼 문자열을 매트릭스 문자열로 변경해 적용하며,
	// "..."를 붙이면, 기존 매트릭스 값에 add를 하는 것과 동일하게 동작한다.
});

testWithFace('엘리먼트 속성 변경으로 이동 후 상위 셋 이동하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	// 직접 속성을 변경해 양 눈을 모은다.
	cLeftEye.attr({
		cx: cLeftEye.attr('cx') + 10,
		cy: cLeftEye.attr('cy') + 10
	});
	rRightEye.attr({
		x: rRightEye.attr('x') - 10,
		y: rRightEye.attr('y') + 10
	});
	
	stHead.transform('t100, 0');
	// 하위 셋의 속성을 변경한다면, 문제 없이 의도한 대로 이동한다.

	// 셋이 여러 뎁스로 구성되어 있고, 하위/상위 셋과 엘리먼트들을 각각 이동해야 하는 상황이라면,
	//   1. 하위 셋과 엘리먼트들은 속성 변경을 이용하고,
	//   2. 최상위 셋만 트랜스폼을 적용하는 방법으로 작업
	// 하는 것이 관리하기 편하고 안전하다.
});

testWithFace('패스는 x, y 속성 변경으로 이동할 수 없다', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	pFace.attr({
		'x': 100,
		'y': 100
	}); // 움직이지 않는다.
	// rect는 x, y 속성을, circle과 ellipse는 cx, cy 속성으로 이동할 수 있지만,
	// path는 속성 변경으로 위치를 이동할 수 없다.
	
	
	// path를 변경하려면 직접 path 속성을 변경해야 한다.
	var originalPathString = pFace.attr('path'); // path string을 가져온다.

	// 100, 100을 이동하는 매트릭스를 생성한다.
	var matrix = Raphael.matrix();
	matrix.translate(100, 100);
	
	// mapPath()로 패스값을 변경한다.
	var transformedPathString = Raphael.mapPath(originalPathString, matrix);
	
	pFace.attr('path', transformedPathString); // path 속성을 설정한다.
});

testWithFace('패스 속성을 변경하는 다른 방법', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	var originalPathString = pFace.attr('path');

	// 매트릭스 객체를 사용하는 대신 트랜스폼 문자열을 사용할 수도 있다.
	// transformPath(pathString, transformString)
	var transformedPathString = Raphael.transformPath(originalPathString, 't100,100');
	
	pFace.attr('path', transformedPathString);
});

testWithFace('셋 이동 후 하위 엘리먼트 속성 변경하기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	stHead.transform('t100,50');
	
	var yOriginalMouth = rMouth.attr('y');

	rMouth.attr('y', yOriginalMouth + 10);
	// 기존 값에서 y축으로 10만큼 이동. 의도한 것과 동일하다.

	// 속성으로 변경하는 것은 절대좌표!!!
});

testWithFace('트랜스폼 전후 bbox 가져오기', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	var bboxMouth = rMouth.getBBox();
	drawBBox(paper, bboxMouth, 'red') // 이동 전 mouth의 bbox
	
	stHead.transform('t100,50'); // 이동한다.
	
	var bboxMouthAfterTransform = rMouth.getBBox();
	drawBBox(paper, bboxMouthAfterTransform, 'blue'); // 이동 후 mouth의 bbox
	
	var bboxMouthOriginal = rMouth.getBBox(true);
	// 원래 영역의 값을 가져오고 싶을 경우, getBBox(true)를 호출하면 된다.
	// drawBBox(paper, bboxMouthOriginal, 'green');
});

function drawBBox(paper, bb, color) {
	paper.rect(bb.x, bb.y, bb.width, bb.height).attr({
		'stroke': color,
		'stroke-dasharray': '-'
	});
}

testWithFace('트랜스폼 전후 bbox 가져오기 - path일 경우', function (paper, stHead, pFace, rMouth, stEye, cLeftEye, rRightEye) {
	var bbHead = stHead.getBBox();
	drawBBox(paper, bbHead, 'red');
});

moduleOnRaphael('페이퍼 생성');

testWithoutPaper('절대 경로로 페이퍼 만들기', function () {
	var
		x = 100,
		y = 400,
		width = 300,
		height = 200;
	
	// 문서에서 x, y 만큼 떨어진 곳에 페이퍼를 생성한다. 
	var paper = Raphael(x, y, width, height);
	// 생성된 svg 엘리먼트의 위치를 콘솔에서 확인해본다.
});

testWithoutPaper('엘리먼트 하위에 페이퍼 만들기', function () {
	var
		elId = 'canvas',
		width = 300,
		height = 200;
	
	// 'canvas' 아이디를 가진 엘리먼트 하위에 페이퍼를 생성한다.
	var paper = Raphael(elId, width, height);
	// 생성된 svg 엘리먼트의 위치를 콘솔에서 확인해본다.
});


moduleOnRaphael('기본 도형 생성');

testWithPaper('원 그리기', function (paper) {
	// paper가 만들어진 것이라 가정하고, 파라미터로 받는다.
	// x = 중점까지의 거리
	var x = 100, y = 100, radius = 20; 
	paper.circle(x, y, radius);
});


testWithPaper('사각형 그리기', function (paper) {
	// x = 꼭지점까지의 거리
	var x = 50, y = 50, width = 100, height = 30;
	paper.rect(x, y, width, height);
});

testWithPaper('라운드 사각형 그리기', function (paper) {
	// r = 모서리 라운드 반지름
	var x = 50, y = 50, width = 100, height = 30, r = 10;
	paper.rect(x, y, width, height, r);
});

testWithPaper('타원 그리기', function (paper) {
	// x = 중점까지의 거리
	// rx = 가로 반지름
	var x = 100, y = 100, rx = 40, ry = 20;
	paper.ellipse(x, y, rx, ry);
});

testWithPaper('선 그리기', function (paper) {
	// @see http://raphaeljs.com/reference.html#Paper.path
	// M = move to = 커서를 옮긴다
	// L = line to = 라인을 그린다.
	// 대문자는 절대경로, 소문자는 상대경로를 의미한다.
	var pathString = 'M40,40 L80,80'; // 40,40 포인트로 이동해서, 80,80 포인트까지 라인을 그린다.
	paper.path(pathString);
});

testWithPaper('상대경로로 선 그리기', function (paper) {
	var pathString = 'm40,40 l80,80'; // 40,40만큼 포인트를 이동해서, 80,80 길이의 라인을 그린다.
	paper.path(pathString);
});

testWithPaper('선으로 삼각형 그리기, 절대경로', function (paper) {
	// Z = 패스를 닫는다. 즉, 처음 패스가 시작한 부분과 연결한다.
	var pathString = 'M80,40 L120,80 L40,80 Z';
	paper.path(pathString);
});

testWithPaper('선으로 삼각형 그리기, 상대경로', function (paper) {
	var pathString = 'M80,40 l40,40 l-80,0 Z';
	paper.path(pathString);
});

testWithPaper('선으로 삼각형 그리기, 연결된 파라미터로', function (paper) {
	// L 커맨드 이후에 x,y 값을 연속으로 넣어도 동일하게 그릴 수 있다.
	var pathString = 'M80,40 l40,40 -80,0 Z';
	paper.path(pathString);
});

testWithPaper('선으로 사각형 그리기', function (paper) {
	// H = 수평 직선을 그린다. V = 수직
	var pathString = 'M40,40 h80 v40 h-80 Z';
	paper.path(pathString);
});

testWithPaper('커브 그리기', function (paper) {
	// C = 커브를 그린다. x1,y1 x2,y2 x,y
	// x1,y1 x2,y2는 커브의 포인터들이다.
	var pathString = 'M40,40 C60,60 80,80 170,20';
	paper.path(pathString);
});

testWithPaper('스무스 커브 그리기', function (paper) {
	// S 커맨드를 사용한다.
	var pathString = 'M40,40 S80,80 170,20';
	paper.path(pathString);
});

testWithPaper('이차 베지어 커브 그리기', function (paper) {
	// Q 커맨드를 사용한다.
	var pathString = 'M40,40 Q80,80 170,20';
	paper.path(pathString);
});

testWithPaper('스무스 이차 베지어 커브 그리기', function (paper) {
	// T 커맨드를 사용한다.
	var pathString = 'M40,40 T80,80 170,20';
	paper.path(pathString);
});

testWithPaper('호 그리기', function (paper) {
	// A 커맨드를 사용한다.
	// rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
	// rx = 반지름
	// x-axis-rotation = X축 회전 각도.
	// large-arc-flag = 해당 좌표에서 큰 호를 그릴 것인가? 0 또는 1
	// sweep-flag = 뒤집을까? 0 또는 1
	// x = 마지막 포인터의 좌표
	var pathString = 'M40,40 A40,20,0,0,0,110,40';
	paper.path(pathString);
});

testWithPaper('부채꼴 그리기', function (paper) {
	var pathString = [
		'M', 100, 100,
		'A', 40, 40, // 반지름 40
			0, 0, 0, 120, 120
	].join();
	paper.path(pathString);
	
});

testWithPaper('가독성 좋은 코드로 선 그리기', function (paper) {
	var pathString = [
	    'M', 40, 40,
	    'A', 40, 20, 0, 0, 0, 100, 40,
	    'M', 40, 60,
	    'v', 20,
	    'h', 60,
	    'v', -20,
	    'z'
	].join();
	// 이와 같이 커맨드,값 단위로 라인을 나눠, 배열 형식으로 표현하면 가독성 좋게 표현할 수 있다.
	// join()은 디폴트로 컴마(,)로 묶는다. 공백(' ')으로 묶어도 관계없다.
	
	paper.path(pathString);
});


moduleOnRaphael('텍스트 생성하기');

testWithPaper('텍스트 만들기', function (paper) {
	// x, y 위치에 텍스트를 넣는다. \n으로 줄바꿈 할 수 있다.
	paper.text(120, 40, 'Paper.text()\nRaphael Learning Test')
		.attr({
			'font-family': '나눔고딕',
			'font-size': 13, // 픽셀 단위
			'font-weight': 'bold',
			'fill': 'red' // 폰트의 컬러는 'color'가 아닌 'fill' 속성을 사용하는 것에 주의한다.
		}); // 생성한 폰트는 긁어 복사할 수 있다.
});

testWithPaper('텍스트를 path로 출력하기', function (paper) {
	// text()가 일반텍스트를 출력하는 반면, print()는 텍스트를 Path로 따서 그린다.
	var x = 20,
		y = 20,
		text = 'paper.print()',
		font = paper.getFont('Arial'),
		size = 50,
		origin = 'middle',
		letterSpacing = 0;
	
	// 어떤 문제인지 모르겠으나, 현재 출력되지 않는다.
	var txt = paper.print(x, y, text, font, size, origin, letterSpacing);
	txt.attr({
		'fill': '#f00'
	});
});
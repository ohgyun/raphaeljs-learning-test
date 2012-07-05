/**
 * 라파엘 테스트용 모듈을 정의한다.
 */
function moduleOnRaphael(moduleName) {
	module(moduleName, {
		setup: clearTest
	});
}

/**
 * 테스트를 초기화한다.
 */
function clearTest() {
	$('#canvas,#code,#log').empty();
	$('svg').remove();
	// 마지막 결과를 확인하기 위해 setup에서 엘리먼트를 삭제한다.
}

/**
 * 로그를 출력한다.
 */
function log(s) {
	$('#log').append('<div>' + String(s) + '</div>');
}

/**
 * 페이퍼 없이 테스트를 실행한다.
 */
function testWithoutPaper(testName, callback) {
	test(testName, function () {
		callback();
		printCode(callback);
	});
}

/**
 * 페이퍼를 생성해 파라미터로 전달하고, 테스트를 실행한다.
 */ 
function testWithPaper(testName, callback) {
	test(testName, function () {
		callback(createPaper());
		printCode(callback);
	});
}

/**
 * 테스트할 페이퍼를 생성한다.
 */ 
function createPaper() {
	var elId = 'canvas', width = 300, height = 200;
	var paper = Raphael(elId, width, height);
	return paper;
}

/**
 * 블럭을 만들고, 테스트를 실행한다. 
 */
function testWithBlock(testName, callback) {
	test(testName, function (paper) {
		var paper = createPaper();
		var block = createBlock(paper);
		callback(paper, block);
		printCode(callback);
	});
}

/**
 * 테스트할 블럭을 만든다.
 */
function createBlock(paper) {
	// 블럭을 그린다.
	var pathString = 'M80,40 l40,0 0,40 40,0 0,40 -120,0 0,-40 40,0 Z';
	var block = paper.path(pathString);
	block.attr('fill', '#fff');
	return block;
}

function testWithFace(testName, callback) {
	test(testName, function (paper) {
		var paper = createPaper();
		var drawed = createFace(paper);
		callback(paper, drawed.head, drawed.face, drawed.mouth, drawed.eye, drawed.leftEye, drawed.rightEye);
		printCode(callback);
	});	
}

function createFace(paper) {
	var face = paper.path([
		'M', 50, 65,
		's', -10, 30, -7, 40,
		's', 20, 20, 40, 20,
		's', 35, 0, 45, -10,
		's', 5, -25, 0, -50,
		's', -40, -5, -30, -10,
		's', -20, 5, -50, -20,
		'c', 0, 10, -2, 10, 3, 35
	]).attr({
		'fill': '#eee',
		'stroke-width': 0.5
	});
	var mouth = paper.rect(70, 100, 40, 10, 8).attr({'fill': '#fff', 'stroke': '#aaa'});
	var leftEye = paper.circle(65, 80, 5).attr({ 'fill': '#000', 'stroke': 'none' });
	var rightEye = paper.rect(105, 80, 17, 2, 2).attr({ 'fill': '#000', 'stroke': 'none' });
	
	var eye = paper.set();
	eye.push(leftEye, rightEye);
	
	var head = paper.set();
	head.push(face, mouth, eye);
	
	return {
		face: face,
		mouth: mouth,
		leftEye: leftEye,
		rightEye: rightEye,
		eye: eye,
		head: head
	};
}

/**
 * 소스코드를 출력한다.
 */
function printCode(callback) {
	var code = callback
			.toString()
			.replace(/</g,'&lt;') // 태그 제거
			.replace(/(\s\/\/[^\n]+\n?)/g, '<span class="comment">$1</span>') // 주석
			.replace(/\n/g, '<br>') // 공백
			.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'); // 탭
	$('#code').html(code);
}

// 페이지 초기화
(function () {
	
	$('#toc a').on('click', function (e) {
		var href = $(this).attr('href');
		var url = location.href.replace(/[\?#].*$/, '') + href;
		if (href) {
			location.assign(url);
			setTimeout(function () {
				location.reload();
			}, 100);
		}
		e.preventDefault();
	});
	
	// 메뉴 하이라이트
	$('a[href=' + location.hash + ']').addClass('on');
	
	// 스크립트 출력
	var hashMathches = /#(chap\d)/.exec(location.hash);
	var testChap = hashMathches && hashMathches[1];
	if (testChap) {
		document.write('<script src="test/raphael.test.' + testChap + '.js"><' + '/script>');
	}
	
}());
moduleOnRaphael('미세하게 그리기');

testWithBlock('라인 두께는 양쪽으로 늘어난다', function (paper, block) {
	// 라인 두께를 확인하기 위한 기준선을 그린다.
	paper.path('M80,0 l0,200');
	
	block.attr({
		'stroke': 'green',
		'stroke-width': 20
	});
	// 라인은 기준선을 중심으로 양쪽으로 커진다.
	// 원래 기준선을 중심으로 두께가 어떻게 변했는지 확인해본다.
});

testWithPaper('테두리를 포함한 사각형의 크기 확인하기', function (paper) {
	var rect = paper.rect(50, 50, 100, 100).attr({
		'stroke-width': 10,
		'stroke': 'orange',
		'fill': '#fff'
	}); // 50,50 위치에 100,100px 짜리 사각형을 그린다.
	
	// 크기 확인을 위한 사각형
	paper.rect(45, 45, 110, 110).attr({
		'stroke': 'none',
		'fill': 'green',
		'opacity': 0.4
	}); // 실제 그려진 사각형은 양옆으로 늘어난 테두리를 포함해 110,100의 크기를 갖는다.

	// bbox 확인
	var bbox = rect.getBBox();
	notEqual(bbox.width, 110, '주의! BBox의 크기도 테두리를 포함하지 않는다.');
});

testWithPaper('1px 라인 그리기', function (paper) {
	paper.path('M0,30 h50').attr({
		'stroke': 'red',
		'stroke-width': 1,
		'stroke-dasharray': '-'
	});
	
	// 1픽셀 라인을 그렸지만, 안티앨리어싱이 적용돼 1픽셀보다 두껍고 뿌옇게 보인다.
	// 1픽셀짜리 라인는 해당 좌표에서 각각 위/아래로 0.5픽셀씩 그려지기 때문이다.
	
	var path = paper.path('M50,30 h50').attr({
		'stroke': 'blue',
		'stroke-width': 1,
		'stroke-dasharray': '-'
	});
	path.node.setAttribute('shape-rendering', 'crispEdges');
	// path에 shape-rendering:crispEdges 스타일을 추가해 안티앨리어싱을 적용하지 않는 방법으로 해결할 수 있다.
	// 하지만, IE에서는 여전히 뿌옇게 보인다.
	
	var path = paper.path('M100,30.5 h50').attr({
		'stroke': 'green',
		'stroke-width': 1,
		'stroke-dasharray': '-'
	});
	// 위/아래 그려진 영역이 정확하게 1픽셀에 채워질 수 있도록,
	// 0.5픽셀 더 이동한 위치에 그리면 모든 브라우저에서 정확히 1픽셀로 표현할 수 있다.
	
	paper.rect(150, 30, 50, 1).attr({
		'stroke': '',
		'fill': 'black'
	});
	// 대안으로 테두리가 없는 1px짜리 사각형을 그릴 수도 있다.
	// 하지만 이 경우 점선을 표현하기 힘들다. 
	
	paper.path('M200,30 h50 v1 h-50 z').attr({
		'stroke': 'none',
		'stroke-width': 0,
		'fill': 'orange'
	});
	// 패스를 만들어서 테두리 없이 속을 채우는 방식(사각형을 그리는 것과 같은 원리)으로도 표현할 수 있다.
});

testWithPaper('1px짜리 박스 테두리 그리기', function (paper) {
	var attr = {
		'stroke': 'blue',
		'stroke-width': 1,
		'fill': 'orange'
	};
	
	paper.rect(20, 20, 60, 150).attr(attr);
	// 선과 마찬가지로 정수 형태로 픽셀을 정확히 채우고 있는 사각형에서 1px 테두리를 그리면
	// 앤티앨리어싱 때문에 의도한 것보다 두껍고 흐리게 보인다.

	paper.rect(120.5, 20.5, 60, 150).attr(attr);
	// 도형이 0.5 픽셀 단위에서 시작하도록 한다.
	
	paper.rect(220, 20, 59.5, 149.5).attr(attr);
	// 단순히 크기만 0.5 픽셀 단위일 경우엔 적용되지 않을 수 있다. 시작 지점이 0.5픽셀 단위가 되도록 한다.
});

testWithPaper('테두리를 가진 박스의 정확한 크기 맞추기', function (paper) {
	var x = 20, y = 20, width = 60, height = 30;
	
	paper.rect(x, y, width, height).attr({'stroke':'none', 'fill':'gray'}); // 테두리가 없는 박스
	paper.rect(x+50, y, width, height).attr({'stroke': '#000', 'stroke-width': 1, 'fill':'orange'});
	// 1px 테두리 박스. 테두리 때문에 실제 크기보다 더 크다.
	
	y = y + 50;
	paper.rect(x, y, width, height).attr({'stroke':'none', 'fill':'gray'});
	paper.rect(x+50 + 0.5, y + 0.5, width, height).attr({'stroke': '#000', 'stroke-width': 1, 'fill':'orange'});
	// 0.5 픽셀 단위로 테두리를 정확히 1픽셀로 만들어도 빈 박스보다 1픽셀 크게 표현된다.
	
	y = y + 50;
	paper.rect(x, y, width, height).attr({'stroke':'none', 'fill':'gray'});
	paper.rect(x+50 + 0.5, y + 0.5, width - 1, height - 1).attr({'stroke': '#000', 'stroke-width': 1, 'fill':'orange'});
	// 따라서, 크기를 1픽셀 줄여주면 원하는 크기와 동일하게 표시된다.
	// 즉, 테두리를 포한해 정확하게 표시하고자 한다면, "0.5픽셀 이동, 1픽셀 줄인다."

	y = y + 50;
	paper.rect(x, y, width, height).attr({'stroke':'none', 'fill':'gray'});
	paper.rect(x+50 + 1, y + 1, width - 2, height - 2).attr({'stroke': '#000', 'stroke-width': 2, 'fill':'orange'});
	// 테두리가 2픽셀일 경우도 마찬가지, 1픽셀 이동하고, 2픽셀 줄인다.

	// 정리하면, 테두리를 n픽셀로 설정하면 n/2픽셀짜리 테두리가 그려지므로,
	// 도형을 n/2픽셀 이동하고, 크기를 n픽셀만큼 줄여주는 것이다.
});

testWithPaper('두 개의 박스를 이용해 테두리 그리기', function (paper) {
	var x = 20, y = 20, width = 60, height = 30;
	
	paper.rect(x, y, width, height).attr({'stroke':'none', 'fill':'gray'}); // 테두리가 없는 박스
	
	x = x + 50;
	paper.rect(x, y, width, height).attr({'stroke': 'none', 'fill': '#000'});
	paper.rect(x+1, y+1, width-2, height-2).attr({'stroke': 'none', 'fill': 'orange'});
	// 앞의 방법이 계산하기 복잡하다면, 면으로 채워진 2개의 박스를 사용하는 방법도 있다.
});

testWithPaper('텍스트 위치시키기', function (paper) {
	// x=120, y=40/80/120의 위치에 기준선을 그린다.
	paper.path('M120,0 v200');
	paper.path('M0,40 h300');
	paper.path('M0,80 h300');
	paper.path('M0,120 h300');
	
	// text-anchor 값을 이용해 정렬/위치시킬 수 있다.
	// 좌우 정렬 뿐 아니라, 텍스트 엘리먼트의 위치도 바뀌는 것에 주의한다.
	paper.text(120, 40, 'Text anchor\nLeft').attr({ 'text-anchor': 'start' });
	paper.text(120, 80, 'Text anchor\nMiddle').attr({ 'text-anchor': 'middle' });
	paper.text(120, 120, 'Text anchor\nEnd').attr({ 'text-anchor': 'end' });
});

testWithPaper('텍스트의 정확한 높이 가져오기', function (paper) {
	// 브라우저마다 렌더링한 폰트의 높이가 다르다.
	function getFontHeight() {
		var text = paper.text(-100, -100, 'agzABC012가핳'), // 보이지 않는 곳에 렌더링한 후
			height = Math.round(text.getBBox().height); // IE에서는 소수 단위로 떨어지는 경우도 있다.
		
		text.remove(); // 테스트 한 엘리먼트는 삭제한다.
		return height;
	}
	
	paper.text(120, 40, Raphael.format('텍스트의 높이 = {0}', getFontHeight()));
});

testWithPaper('테두리를 가진 사각형의 BBox 구하기', function (paper) {
	// 테두리가 20인 100, 100 크기의 사각형을 그린다.
	var rect = paper.rect(50, 50, 100, 100);
	rect.attr({
		'stroke-width': 20
	});
	
	// bbox를 구하고, bbox 크기만큼 사각형을 그려본다.
	var bbox = rect.getBBox();
	paper.rect(bbox.x, bbox.y, bbox.width, bbox.height).attr({
		'stroke': 'yellow',
		'stroke-dasharray': '-'
	});
	// bbox는 테두리를 포함하지 않는다.
	// 특히, bbox로 이벤트를 처리할 때 bbox와 이벤트 발생 경계가 다르다는 것에 주의한다.
});

testWithPaper('텍스트를 감싸는 사각형(툴팁) 그리기', function (paper) {
	var text = paper.text(100, 40, '길이를 알 수 없는 텍스트 사이즈')
					.attr({ 'font-size': 12, 'text-anchor': 'start' });
	
	// bbox를 이용해 텍스트의 사이즈를 알아온다.
	var textBBox = text.getBBox();
	
	var padding = 5,
		x = textBBox.x - padding,
		y = textBBox.y - padding,
		w = textBBox.width + (padding * 2),
		h = textBBox.height + (padding * 2);
	
	paper.rect(x, y, w, h).attr({
		'stroke': 'green'
	});
});

testWithPaper('여러 스타일을 포함한 텍스트 그리기', function (paper) {
	// "사용자 <strong>100</strong>명"과 같이 스타일을 넣고자 할 때엔,
	// 각 스타일을 포함한 엘리먼트로 나눠야 한다.
	var attr = {
		'font-size': 12,
		'font-family': '나눔고딕',
		'text-anchor': 'start' // 좌측 정렬한다.
	};
	
	// 일반 텍스트
	paper.text(80, 40, '사용자 100명').attr(attr);
	
	// 스타일 텍스트
	// 아래와 같이 text의 bbox 영역을 이용해 텍스트 엘리먼트를 연결한다.
	var first = paper.text(80, 80, '사용자 ').attr(attr);
	var firstBox = first.getBBox();
	var second = paper.text(firstBox.width + firstBox.x, 80, ' 100') 
					.attr(attr).attr({
						'font-weight': 'bold',
						'fill': 'red'
					}); // first의 끝과 second의 앞 부분에 스페이스를 넣었지만, 공백이 적용되지 않은 것에 주의한다.
	var secondBox = second.getBBox();
	var third = paper.text(secondBox.width + secondBox.x, 80, '명').attr(attr);
	
	
	// 작성한 텍스트를 아래와 같이 set으로 묶어두면 관리하기 편하다.
	var stText = paper.set();
	stText.push(first, second, third);
	
	stText.animate({
		'transform': 't100,0'
	}, 2000);
});

testWithPaper('IE8 이하 버전에서 텍스트가 씹히는 문제 해결하기', function (paper) {
	var x = 250,
		y = 40,
		value = '오른쪽 정렬한 숫자: 10000',
		fontAttr = {
			'font-size': 11,
			'font-family': '돋움',
			'text-anchor': 'end' // 오른쪽 정렬
		};
	
	paper.text(x, y, value).attr(fontAttr);
	// 1을 제외한 특정 숫자의 경우,
	// 오른쪽 정렬하면 IE8 이하에서 VML로 표시할 때 오른쪽 약간 끝이 잘린다.
	
	if (Raphael.vml) {
		// VML에서 잘리는 것을 방지하기 위해 오른쪽 끝에 공백을 두는 꼼수를 적용한다.
		value = value + ' ';
		x += 4; // 공백만큼 적당히 이동해준다.
	}
	
	paper.text(x, y+40, value).attr(fontAttr);
});

testWithPaper('VML로 텍스트를 출력했을 때 안티앨리어싱 없애기', function (paper) {
	var x = 150,
		y = 50,
		str = 'abcdefg ABCDEFG 01234 가나다라',
		fontAttr = {
			'font-size': 12,
			'font-family': '돋움'
		};	
	 
	paper.text(x, y, str).attr(fontAttr);
	// IE8 이하 하위 버전에서 확인해본다.
	// 라파엘은 기본적으로 VML의 TextPath를 사용해 텍스트를 그린다.
	// TextPath의 특성 상, 사이즈가 작은 텍스트일 경우 안티앨리어싱이 적용돼 뿌옇게 보인다.
	// @see TextPath http://msdn.microsoft.com/en-us/library/bb250511(v=vs.85).aspx
	
	var textB = paper.text(x, y+50, str).attr(fontAttr);
	textB.node.style.antialias = false;
	// 위와 같이 텍스트 노드 style의 antialias 속성을 false로 설정하면, 안티앨리어싱을 제거할 수 있다.
	// 하지만, 글자가 깨져 제대로 보이지 않는다.
	// @see https://groups.google.com/group/cufon/browse_thread/thread/7a8b4f572f8081e1/27d564922538da29
	
	var vml = [
		'<v:shape style="position: relative; width: 100px; height: 100px">',
			'<v:textbox>',
				'<font size="2" face="돋움">abcdefg ABCDEFG 01234 가나다라</font>',
			'</v:textbox>',
		'</v:shape>' 	           
	].join('');
	if (Raphael.vml) { $('#canvas').append(vml); }
	// VML에서 텍스트를 출력할 때 textpath가 아니라 textbox를 사용한다면, 말끔히 표시할 수 있긴 하다.
    // 하지만, 위에서도 언급했듯이 라파엘에서는 textpath만 사용한다.
	// 텍스트를 쉽게 변형할 수 있는 등 미세하게 컨트롤 할 수 있기 때문인 것으로 추측한다. 
});

testWithPaper('SVG 엘리먼트의 위치 옮기기', function (paper) {
	var newPaper = Raphael(0, 0, 100, 100);
	newPaper.rect(0, 0, 100, 100).attr('fill', 'red');
	
	var svgWrapper = newPaper.canvas; // 전체 SVG 객체는 canvas 속성으로 가져올 수 있다.
	
	svgWrapper.style.left = '100px';
	svgWrapper.style.top = '500px';
	svgWrapper.style.width = '50px';
	svgWrapper.style.height = '50px';
	// SVG 객체 또한 DOM이기 때문에 위와 같이 처리할 수 있다.
	// 차트에서 툴팁과 같이 SVG 영역을 밖까지 표시되어야 하는 경우라면, 위 방법을 고려해보는 것도 좋겠다. 
});

testWithPaper('라파엘로 투명한 그래디언트 구현하기', function (paper) {
	var back = paper.circle(50, 50, 40).attr({
		'fill': 'orange'
	}); // 배경 원
	
	// 그래디언트 역할을 할 마스크 원
	var mask = paper.circle(50, 50, 39).attr({
		'stroke': 'none',
		'fill': 'r(0.2,0.2)#fff:20-#eee:90',
		'opacity': 0.2 // 투명하게 한다.
	});
	// 라파엘은 마지막 그래디언트 스탑에만 opacity를 적용할 수 있다.
	// 그래디언트 마스크의 좌상단 스탑에는 opacity가 적용되지 않은 걸 볼 수 있다. 
	// @see http://groups.google.com/group/raphaeljs/browse_thread/thread/b33adf3632ce3196
	// @see https://github.com/DmitryBaranovskiy/raphael/blob/master/raphael.svg.js#L506
	
	
	if (Raphael.svg) {
		// 직접 SVG 객체의 속성을 바꿔 적용할 수 있다.
		// 복제한다.
		back.clone().attr('cx', 150);
		var mask2 = mask.clone().attr('cx', 150);
		
		var gradientUrl = mask2[0].getAttribute('fill'); //-> url(#1r_0.2_0.2__fff:30-_eee:90)
		var gradientId = gradientUrl.substring(5, gradientUrl.length - 1); //-> 1r_0.2_0.2__fff:30-_eee:90
		// 라파엘은 그래디언트를 별도의 defs 엘리먼트로 만들어 가지고 있으며,
		// 위와 같은 형태의 아이디를 가지고 있다.
		// @see https://github.com/DmitryBaranovskiy/raphael/blob/master/raphael.svg.js#L99
		
		var elRadialGradient = document.getElementById(gradientId); // 그래디언트 엘리먼트
		var firstStop = elRadialGradient.firstChild; // 첫번째 스탑 엘리먼트
		
		firstStop.setAttribute('stop-opacity', 0.6); // 첫번째 스탑에 opacity를 적용한다.
	}
	
});

testWithPaper('이미지를 사용해 그래디언트 구현하기', function (paper) {
	var back = paper.circle(100, 100, 70).attr({
		'fill': 'orange'
	});
	
	var src = 'img/gradient.png';
	var gradientImg = paper.image(src, 30, 30, 140, 140); // 잘 된다!!
});

testWithPaper('base64로 인코딩한 이미지 데이터를 사용해 그래디언트 구현하기', function (paper) {
	var back = paper.circle(100, 100, 70).attr({
		'fill': 'orange'
	});
	
	// img/gradient.png를 base64로 인코딩한 값
	var src = 'data:;base64,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';
	var gradientImg = paper.image(src, 30, 30, 140, 140);
	// 모던 브라우저에서는 잘 표현하나, IE8 이하 VML로 표시될 때엔 투명이 적용되지 않으니 주의한다.
});

testWithPaper('패스로 안이 뚫린 도형 그리기', function (paper) {
	var bigRectClockWisePath = 'M50,50 h200 v100 h-200 z ';
	var smallLeftRectClockWisePath = 'M70,70 h50 v50 h-50 z ';
	var smallRightRect_ANTI_clockWisePath = 'M150,70 v50 h50 v-50 z';
	
	var path = bigRectClockWisePath +
			smallLeftRectClockWisePath +
			smallRightRect_ANTI_clockWisePath;
	
	paper.path(path).attr({
		'stroke': 'none',
		'fill': '#000'
	});
	// 패스 안에 뚫린 공간을 두려면, 자신을 포함하는 패스의 진행방향과 반대로 진행해야 한다.
	// 시계방향으로 그린 큰 사각형 안에,
	// 같은 방향으로 그린 왼쪽의 작은 사각형은 내용이 채워져 구분할 수 없는 것을 알 수 있다.
});

testWithPaper('패스로 원 그리기', function (paper) {
	// 선으로 원을 표현하기 위해 아래와 같이 반호를 두 번 그려 원을 완성하는 함수를 작성한다.
	function getCirclePath(x, y, r) {
		return [
			'M', x, y-r,
			'A', r, r, 0, 1, 1, x, y+r,
			'A', r, r, 0, 1, 1, x, y-r,
			'z'
		].join(); // 시계방향으로 반호를 두 번 그려 완성한다.
	}
	
	var x = 100, y = 100, r = 50;
	
	paper.circle(x, y, r).attr({
		'stroke': 'red'
	}); // 비교를 위한 원
	
	paper.path(getCirclePath(x, y, r)).attr({
		'stroke': 'green',
		'fill': 'orange'
	}); // 위 원과 동일한 것을 확인할 수 있다.
});

testWithPaper('패스로 안이 뚫린 원 그리기', function (paper) {
	// 바깥 원과 안쪽 원의 방향을 구분할 수 있게 함수를 보완한다.
	function getCirclePath(x, y, r, clockwise) {
		var sweepFlag = clockwise ? 1 : 0; // 라파엘의 Arc 문자열은 sweep-flag를 지원한다.
		
		return [
			'M', x, y-r,
			'A', r, r, 0, 1, sweepFlag, x, y+r,
			'A', r, r, 0, 1, sweepFlag, x, y-r,
			'z'
		].join(); // 시계방향으로 반호를 두 번 그려 완성한다.
	}
	
	var x = 100, y = 100, r = 50;
	var circle = getCirclePath(x, y, r, true);
	var hole = getCirclePath(x, y, r-20, false);
	
	paper.path(circle + hole).attr({
		'fill': 'orange'
	});
});
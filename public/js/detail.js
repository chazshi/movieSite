$(function(){
	// detail页面用户头像点击后，添加新的隐藏表单域，或者更新表单域信息
	$('.comment').click(function(e){
		var target = $(this);
		var toId = target.data('tid');		//评论对象
		var commentId = target.data('cid');		//评论人

		var toName = target.data('tname');

		if($('#user-id').val() != toId.toString()){
			if($('#toId').length > 0) {
				//存在重新赋值
				$('#toId').val(toId);	
			} else {	
				//不存在添加
				$('<input>').attr({
					type: 'hidden',
					id: 'toId',
					name: 'comment[tid]',
					value: toId
				}).appendTo('#commentForm');
			}

			if($('#commentId').length > 0) {
				$('#commentId').val(commentId);
			} else {
				$('<input>').attr({
					type: 'hidden',
					id: 'commentId',
					name: 'comment[cid]',
					value: commentId
				}).appendTo('#commentForm');
			}

			// placeholder="成功状态"
			$('#relpy-area').attr('placeholder', '回复 ' + toName + ':');
		}
	});
});
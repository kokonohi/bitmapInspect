$(function (){
	var attendanceInfo = {
		init: function() {
			attendanceInfo.mobileEventOverWrite();
			attendanceInfo.tableEventAttach();
			attendanceInfo.formFocus();
			attendanceInfo.selectCustomize();
			attendanceInfo.checkboxCustomize();
			attendanceInfo.radioButtonCustomize();
			attendanceInfo.dateInput();
			attendanceInfo.submitEventAttach();
		},
		
		mobileEventOverWrite: function() {
		},

		tableEventAttach: function() {
			$('table.dataTableBody').each(function() {
				$(this).find('tr').hover(function() {
					$(this).addClass('onOver');
				},
				function() {
					$(this).removeClass('onOver');
				});
			});
		},

		formFocus: function(){
			$('.inputText:not(.dateInput)').bind('focus', function() {
				$(this).parents('.item').addClass('active');
			});
			$('.inputText:not(.dateInput)').bind('blur', function() {
				$(this).parents('.item').removeClass('active');
			});

			// textarea auto resize event
			$('textarea.inputText').bind('focus', function() {
				$('textarea.inputText').bind('webkitTransitionEnd', function(e) {
					$(this).autosize({append: "\n"});
					$('textarea.inputText').unbind('webkitTransitionEnd');
				});
			});
			$('textarea.inputText').bind('blur', function() {
				if($(this).val().length === 0) {
					$(this).css('height', '');
				}
			});
		},

		selectCustomize: function() {
			$('select.selectMenu').each(function() {
				var $this = $(this);
				var $parent = $this.parent()
				    defaultText = $this.find('option[selected]').text(),
				    selectedNum = $this.data('selected');

				var init = function() {
					var $customSelectList = null;

					// select element replace to text element 
					$(this).addClass('setHide');
					$parent.append('<a class="customSelect" href="/">' + defaultText + '</a>');

					// option elements replace to list elements
					$parent.append('<div class="customSelectBox setHide"><ul class="customSelectList"></ul></div>');
					$customSelectList = $('ul.customSelectList', $parent);
					$('option', $this).each(function (){
						var $child = $(this);
						if($child.attr('selected') === 'selected') {
							return;
						}
						$customSelectList.append('<li data-id="' + $child.attr('value') + '"><span class="icon checked">&#XB4;</span><span class="listText">' + $child.text() + '</span></li>');
					});
				},
				selectedCheck = function() {
					if(selectedNum) {
						$('ul.customSelectList li').filter('[data-id="' + selectedNum + '"]').trigger('click');
					}
				}

				init();

				$('.customSelect').bind('click', function() {
					$(document).trigger('click.selectMenu');
					$(this).trigger('focus');
					return false;
				});

				$('.customSelect').bind('focus', function() {
					var $customSelectBox = $(this).next('.customSelectBox');
					
					$(this).parents('.item').addClass('active');
					$customSelectBox.removeClass('setHide');

					$(window).bind('keydown.selectMenu', function(e) {
						if(e.keyCode === 9) {
							$(document).trigger('click.selectMenu');
						}
					});

					// selectMenu hide event attach
					$(document).bind('click.selectMenu', function(e) {
						$this.parents('.item').removeClass('active');
						$customSelectBox.addClass('setHide');

						$(window).unbind('keydown.selectMenu');
						$(document).unbind('click.selectMenu');
					});
				});

				$parent.on('click', 'li', function() {
					var $this = $(this);
					var $parent = $this.parent();
					var $form = $this.parents('.form');
					var $selectMenu = $($('select.selectMenu'), $parent);
					
					$selectMenu.val($this.data('id'));
					$('.customSelect', $form).addClass('selected').text($this.find('span.listText').text());
					$('li', $parent).removeClass('selected');
					$(this).addClass('selected');
					console.log($selectMenu.val());
				});

				selectedCheck();
			});
		},

		checkboxCustomize: function() {
			$('input.inputCheck').each(function() {
				var $this = $(this);
				var $label = $this.parents('label');

				$this.addClass('setHide');
				$label.prepend('<span class="iconWrapper"><i class="icon">&#XB4;</i></span>');

				$label.bind('click', function() {
					var $this = $(this);
					var $input = $this.find('input.inputCheck');

					if($this.hasClass('checked')) {
						$this.removeClass('checked');
						$input.removeAttr('checked');
					} else {
						$this.addClass('checked');
						$input.attr('checked', 'checked');
					}
					return false;
				});
			});
		},

		radioButtonCustomize: function() {
			$('input.inputRadio').each(function() {
				var $this = $(this);
				var $label = $this.parents('label'),
				    $inputRadioGroup = $this.parents('div.inputRadioGroup');
				var formChange = function(type) {
					var $userSettingForm = $('#userSettingForm');

					$userSettingForm.find('div.item.setHide.' + type).removeClass('setHide');
					$userSettingForm.find('div.item:not(.' + type + ')').addClass('setHide');
				};

				$this.addClass('setHide');
				$label.prepend('<span class="iconWrapper"><i class="icon"></i></span>');

				$label.bind('click', function() {
					var $this = $(this);

					if($label.hasClass('selected')) {
						return false;
					}

					$inputRadioGroup.find('label.selected').removeClass('selected');
					$this.addClass('selected');
					formChange($this.data('form-type'));

					return false;
				});
			});
		},

		dateInput: function() {
			var $inputDateElement = null,
			    day = [];
			var inputDateFocus = function(target) {
					$inputDateElement = $(target);
					$inputDateElement.parents('.item').addClass('active');
				},
				inputDateBlur = function() {
					$inputDateElement.parents('.item').removeClass('active');
				};

			// set today Date
			day.date = new Date();
			day.year = day.date.getFullYear();
			day.month = day.date.getMonth() + 1;
			day.day = day.date.getDate();
			if (day.month < 10) { day.month = "0" + day.month; }
			if (day.day < 10) { day.day = "0" + day.day; }

			$('input.dateInput').each(function() {
				var $this = $(this);

				$this.datepicker({
					dateFormat: 'yy/mm/dd',
					beforeShow: inputDateFocus,
					onClose: inputDateBlur
				});

				if($this.hasClass('setToday')) {
					$this.val(day.year + '/' + day.month +　'/' + day.day + '/');
				}
			});
		},

		submitEventAttach: function() {
			$('.clickSubmit').bind('click', function() {
				var $form = $(this).parents('form'),
				    nextPage = $(this).attr('href');

				$form.find('input.submit').trigger('click');

				return false;
			});
		}
	};

	attendanceInfo.init();
});

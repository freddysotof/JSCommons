"use strict";
var KTDatatablesBasicBasic = function () {
    $.fn.dataTable.Api.register('column().title()', function () {
        return $(this.header()).text().trim();
    });

    var initTable1 = async function (TblOpts = null, Columns = null, TblActions = null, OrderBy = null, FooterSum = null) {
        var colDefs = [];
        var RowGroup = null;
        await colDefs.push({
            targets: (TblActions) ? TblActions.ActionCol : null,
            orderable: false,
            width: (TblActions && TblActions.Width) ? TblActions.Width : null,
            render: function (data, type, full, meta) {
                if (TblActions) {
                    var content = "";
                    $.each(TblActions.Buttons, function (key, val) {
                        content = content +
                            `
                            <${(val.Type == "button") ? val.Type + ' type="button"' : val.Type} style="cursor:pointer"   title="${val.Title}" id="TblAction${key + 1}"
                            class=" TblAction ${val.IsIcon ? "btn btn-icon btn-icon-md btn-sm" : ""}   ${(val.Class) ? val.Class : "btn-clean"}"   onClick="${val.OnClick}"
                            ${val.Type == "a" && val.Href ? `href="${val.Href}"` : ""}>
                                ${val.IsIcon ? `<i class="${val.Icon}"></i>` : val.Title}
                            </${val.Type}>
                            `
                    })
                    return content;
                } else { return null; }
            }
        });
        if (OrderBy && OrderBy.NonOrderable)
            colDefs.push({
                targets: (OrderBy && OrderBy.NonOrderable) ? OrderBy.NonOrderable.split(",").map(Number) : null,
                orderable: false,
            });
        if (OrderBy && OrderBy.NonVisible)
        colDefs.push({
            targets: (OrderBy && OrderBy.NonVisible) ? OrderBy.NonVisible.split(",").map(Number) : null,
            visible: false,
        });
        if (TblOpts && TblOpts.ColWidth) {
            $.each(TblOpts.ColWidth, function (key, val) {
                colDefs.push({
                    targets: (val.Targets) ? val.Targets.split(",").map(Number) : null,
                    width: (val.Width) ? val.Width : null,
                    className: (val.Class) ? val.Class : null
                });
            });
        }
        if (TblOpts && TblOpts.RowGroup) {
            if ((!isNaN(TblOpts.RowGroup.Target)) && (TblOpts.RowGroup.Target != null) || (TblOpts.RowGroup.Start.Cols.length > 0) || (TblOpts.RowGroup.End.Cols.length > 0)) {
                RowGroup = {
                    className: "",
                    color: `#${TblOpts.RowGroup.Color}`,
                    dataSrc: (TblOpts.RowGroup.Target) ? parseInt(TblOpts.RowGroup.Target) : 0,
                    startClassName: `dtrg-start ${(TblOpts.RowGroup.Start && TblOpts.RowGroup.Start.BgColor) ? "kt-bg-" + TblOpts.RowGroup.Start.BgColor : "dtrg-group"}`,
                    startRender: ((TblOpts.RowGroup.Start.Cols.length > 0) && (!TblOpts.RowGroup.Target)) ? (function (rows, group) {
                        var data = "";
                        var RowSize = 0;
                        if ((TblOpts.RowGroup.Start.Cols) && TblOpts.RowGroup.Start.Cols.length % 2 == 0)
                            RowSize = 12 / TblOpts.RowGroup.Start.Cols.length
                        else
                            RowSize = 4
                        $.each(TblOpts.RowGroup.Start.Cols, function (key, val) {
                            var total = rows.data().pluck(val.Target).reduce(function (a, b) {
                                return a + b.replace(/[^\d]/g, '') * 1;
                            }, 0)

                            data = data +
                                `
                            <div id="${val.Id}${group}"class="col-md-${RowSize}" style="display:inline-block;${(TblOpts.RowGroup.Start.Color) ? "color:" + TblOpts.RowGroup.Start.Color : ""}"
                            data-total=${total}>
                            ${val.Html
                                    .split("{title}").join((val.Title) ? val.Title : "{title}")
                                    .split("{state}").join((val.State) ? val.State : "{state}")
                                    .split("{data}").join((val.Data) ? val.Data : "{data}")
                                    .split("{group}").join(group)
                                    .split("{total}").join(total)}
                            </div>`
                        })
                        return data;
                    }) :
                        function (rows, group) { return group },
                    endClassName: `dtrg-end ${(TblOpts.RowGroup.End && TblOpts.RowGroup.End.BgColor) ? "kt-bg-" + TblOpts.RowGroup.End.BgColor : "dtrg-group"}`,
                    endRender: ((TblOpts.RowGroup.End.Cols.length > 0) && (!TblOpts.RowGroup.Target)) ? (function (rows, group) {
                        var data = "";
                        var RowSize = 0;
                        if ((TblOpts.RowGroup.End.Cols) && TblOpts.RowGroup.End.Cols.length % 2 == 0)
                            RowSize = 12 / TblOpts.RowGroup.End.Cols.length
                        else
                            RowSize = 4
                        $.each(TblOpts.RowGroup.End.Cols, function (key, val) {
                            var total = rows.data().pluck(val.Target).reduce(function (a, b) {
                                return a + b.replace(/[^\d]/g, '') * 1;
                            }, 0)
                            data = data +
                                `
                            <div id="${val.Id}${group}" class="col-md-${RowSize}" style="display:inline-block;${(TblOpts.RowGroup.End.Color) ? "color:" + TblOpts.RowGroup.End.Color : ""}"
                             data-total=${total}>
                            ${val.Html
                                    .split("{title}").join((val.Title) ? val.Title : "{title}")
                                    .split("{state}").join((val.State) ? val.State : "{state}")
                                    .split("{data}").join((val.Data) ? val.Data : "{data}")
                                    .split("{group}").join(group)
                                    .split("{total}").join(total)}
                            </div>`
                        })
                        return data;
                    }) : null,


                }
            }
        }
        if (Columns && Columns.Options) {
            $.each(Columns.Options, async function (key, col) {
                await colDefs.push({
                    targets: parseInt(col.Target),
                    width: (col.Width) ? col.Width : null,
                    className: (col.Class) ? col.Class : null,
                    render: function (data, type, full, meta) {
                        if (col.Data && col.Data.length > 0) {
                            var html = col.Html;
                            var arr = col.Data;
                            var objs = arr.find(o => ((o.Identifier) ? o.Identifier.toString().toLowerCase() : "") === ((data) ? data.toString().toLowerCase() : ""))
                            if ((objs) ? typeof objs.Identifier === 'undefined' : typeof objs === 'undefined') {
                                return data;
                            }
                            return html.split("{state}").join(objs.State).split("{title}").join(objs.Title);
                        } else {
                            return data;
                        }

                    }
                });
            });
        }
  
        // begin first table
        var selector = '#kt_table_1';
        if (TblOpts && TblOpts.TableName) {
            if (TblOpts.TableName == 'kt-table')
                selector += `,.${TblOpts.TableName}`;
            else
                selector += `,#${TblOpts.TableName}`;
        } else {
            selector += ',.kt-table'
        }
        var table = await $(selector).DataTable({
            scrollX: (TblOpts && TblOpts.Scrollable) ? TblOpts.Scrollable.X : false,
            scrollY: (TblOpts && TblOpts.Scrollable) ? TblOpts.Scrollable.Y : "", //frecuentemente la desorganiza
            scrollCollapse: (TblOpts && TblOpts.Scrollable) ? TblOpts.Scrollable.ScrollColapse : false,
            rowGroup: RowGroup,
            responsive: false,
            paging: (TblOpts && TblOpts.Paginator) ? TblOpts.Paginator.Paging : true,
            info: (TblOpts) ? TblOpts.Paging : true,
			 //DOM Layout settings
			dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
            //sDom: "",
			lengthMenu: [5, 10, 25, 50],

            pageLength: (TblOpts && TblOpts.Paginator) ? TblOpts.Paginator.PageLength : 5,

			language: {
				'lengthMenu': 'Mostrar  _MENU_',
            },
         
            // Order settings

            order: [(OrderBy && OrderBy.DefaultOrder) ? OrderBy.DefaultOrder : 0, (OrderBy && OrderBy.Orientation) ? OrderBy.Orientation : "asc"],
            // ordenar por group
            orderFixed: (TblOpts && TblOpts.RowGroup && TblOpts.RowGroup.FixedOrder && !isNaN(parseInt(TblOpts.RowGroup.FixedOrder.Target)))
                ? [TblOpts.RowGroup.FixedOrder.Target, TblOpts.RowGroup.FixedOrder.Orientation] : null,
            //orderFixed: (TblOpts) ?
            //    [TblOpts.RowGroup.FixedOrder.Target, TblOpts.RowGroup.FixedOrder.Orientation] : null,
			//headerCallback: function(thead, data, start, end, display) {
			//	thead.getElementsByTagName('th')[0].innerHTML = `
   //                 <label class="kt-checkbox kt-checkbox--single kt-checkbox--solid">
   //                     <input type="checkbox" value="" class="kt-group-checkable">
   //                     <span></span>
   //                 </label>`;
			//},

            columnDefs: colDefs,
            footerCallback: async function (row, data, start, end, display) {
                if (FooterSum) {
                    var api = this.api(), data;
                    var footerHtml = "<div class='row'>";
                    var RowSize = 0;
                    var ArraysLength = 0;
                    if (FooterSum.RowSum)
                        ArraysLength += FooterSum.RowSum.length;
                    if (FooterSum.RowInfo)
                        ArraysLength += FooterSum.RowInfo.length
                    if (ArraysLength % 2 == 0)
                        RowSize = 12 / ArraysLength
                    else
                        RowSize = 4
                    // RECORRER ARRAY DE SUMA DE COLUMNAS
                    await $.each(FooterSum.RowSum, async function (key, val) {
                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                        };
                        let j = [];
                        var total = 0;
                        var pageTotal = 0;
                   
                        for (let j in val.RowPositions) {
                            // Total over all pages
                            total += await api.column(val.RowPositions[j]).data().reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);
                            // Total over this page
                            pageTotal += await api.column(val.RowPositions[j], { page: 'current' }).data().reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);
                        }
                        footerHtml = footerHtml +
                            `<div class="col-md-${RowSize}" id="footer${val.Id}"  style="display:inline-block;" data-total='${total}'>
                                    ${val.Title}: ${val.Type == "int" ? "" : "$"} ${KTUtil.numberString(pageTotal.toFixed(2))} de ( ${val.Type == "int" ? "" : "$"} ${KTUtil.numberString(total.toFixed(2))} )
                            </div> `
                        $(api.column().footer()).html(footerHtml);
                         
                    })
                    //  RECORRER ARRAY DE INFORMACIONES (STATUS, ETC)
                    $.each(FooterSum.RowInfo, function (key, val) {
                           // Update footer
                        //if (key == last) {
                        if (val.State)
                            val.Html = val.Html.split("{state}").join(val.State) 
                        if (val.Data)
                            val.Html =  val.Html.split("{data}").join(val.Data) 
                        footerHtml = footerHtml +
                            `<div class="col-md-${RowSize} style="display:inline-block" id="footer${val.Id}">
                                ${val.Title} 
                                ${val.Html}
                            </div>`
                        $(api.column().footer()).html(footerHtml);
                        //}
                    })
                    $(api.column().footer()).html(footerHtml + '</div>');

                }
            },
        });

        $(`${selector}`).on('draw.dt', async function () {
            table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var node = this.node();
                var row = this;
                var Id = (this).data()[((TblActions && TblActions.TargetId) ? TblActions.TargetId : 0)]
                var name = (TblOpts && TblOpts.TableName) ? TblOpts.TableName.replace("Tbl", "").replace("Table", "").replace("Tabla", "").replace("tabla","") : null;
                $(node).attr('id', `${(name) ? name : ""}${Id}`);
                $.each($(node).find('.TblAction'), function (key, val) {
                    var params = "";
                    var Targets = ((TblActions && TblActions.Buttons && TblActions.Buttons[key].Targets) ? TblActions.Buttons[key].Targets.split(",").map(Number) : "");
                    if (Targets) {
                        $.each(Targets, function (key, val) {
                            if (key == (Targets.length - 1))
                                params += `'${(row).data()[val]}'`
                            else
                                params += `'${(row).data()[val]}',`;
                        })
                    }
                    var method = $(this).attr("onclick").replace(/\s*\(.*?\)\s*/g, '');
                    $(this).attr("onclick", `${method}(${params})`)
                })
                //$(this).find('#TblAction1').attr('onClick', `Editar${name}(${Id})`);
                //$(this).find('#TblAction2').attr('onClick', `Eliminar${name}(${Id})`);
            })
        })

		table.on('change', '.kt-group-checkable', function() {
			var set = $(this).closest('table').find('td:first-child .kt-checkable');
			var checked = $(this).is(':checked');

			$(set).each(function() {
				if (checked) {
					$(this).prop('checked', true);
					$(this).closest('tr').addClass('active');
				}
				else {
					$(this).prop('checked', false);
					$(this).closest('tr').removeClass('active');
				}
			});
		});

		table.on('change', 'tbody tr .kt-checkbox', function() {
			$(this).parents('tr').toggleClass('active');
		});
    };


	return {

		//main function to initiate the module
        init: function (TblOpts, Columns, TblActions, OrderBy, FooterSum) {
            initTable1(TblOpts, Columns, TblActions, OrderBy, FooterSum);
		}
	};
}();

jQuery(document).ready(function() {
	//KTDatatablesBasicBasic.init();
});
			//columnDefs: [
			//	//{
			//	//	targets: 0,
			//	//	width: '30px',
			//	//	className: 'dt-right',
			//	//	orderable: false,
			//	//	render: function(data, type, full, meta) {
			//	//		return `
   // //                    <label class="kt-checkbox kt-checkbox--single kt-checkbox--solid">
   // //                        <input type="checkbox" value="" class="kt-checkable">
   // //                        <span></span>
   // //                    </label>`;
			//	//	},
			//	//},
   //             //<span class="dropdown">
   //             //    <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
   //             //        <i class="la la-ellipsis-h"></i>
   //             //    </a>
   //             //    <div class="dropdown-menu dropdown-menu-right">
   //             //        <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>
   //             //        <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>
   //             //        <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>
   //             //    </div>
   //             //</span>`
   //             {
   //                 targets: (IsOptionEnabled) ? -1 : null,
			//		//title: 'Opciones',
   //                 orderable: (IsOptionEnabled) ? -1 : null,
			//		render: function(data, type, full, meta) {
   //                     if (IsOptionEnabled) {
   //                         return `
   //                         <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar" id="TblAction1">
   //                             <i class="la la-edit"></i>
   //                         </a>
   //                        <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Eliminar" id="TblAction2">
   //                             <i class="la la-trash"></i>
   //                         </a>
   //                         `
   //                             ;
   //                     } else { return null; }
			//		},
			//	},
   //             {
   //                 targets: (isNaN(StatusCol)) ? null : StatusCol,
   //                 render: function (data, type, full, meta) {

			//			var status = {
			//				1: {'title': 'Pendiente', 'class': 'kt-badge--metal'},
			//				2: {'title': 'Recibido', 'class': ' kt-badge--brand'},
			//				3: {'title': 'Canceled', 'class': ' kt-badge--primary'},
			//				4: {'title': 'Success', 'class': ' kt-badge--success'},
			//				5: {'title': 'Info', 'class': ' kt-badge--info'},
			//				6: {'title': 'Danger', 'class': ' kt-badge--danger'},
			//				7: {'title': 'Warning', 'class': ' kt-badge--warning'},
   //                     };
			//			if (typeof status[data] === 'undefined') {
			//				return data;
			//			}
			//			return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
			//		},
			//	},
   //             {
   //                 targets: (isNaN(TipoCol)) ? null : TipoCol,
			//		render: function(data, type, full, meta) {
			//			var status = {
   //                         1: { 'title': 'Documentos', 'state': 'primary'},
			//				2: {'title': 'Valija', 'state': 'danger'},
   //                         3: { 'title': 'Equipos Tecnologicos', 'state': 'accent' },
   //                         4: { 'title': 'Otros', 'state': 'brand' },
			//			};
			//			if (typeof status[data] === 'undefined') {
			//				return data;
			//			}
			//			return '<span class="kt-badge kt-badge--' + status[data].state + ' kt-badge--dot"></span>&nbsp;' +
			//				'<span class="kt-font-bold kt-font-' + status[data].state + '">' + status[data].title + '</span>';
			//		},
   //             },
   //             {
   //                 "targets": (OrderBy) ? OrderBy.NonOrderable.split(",").map(Number) : null,
   //                 "orderable": false,
   //             },
   //         ],
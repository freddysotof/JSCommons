"use strict";
var KTDatatablesBasicScrollable = function () {

    var initTable1 = async function (TblOpts = null, Columns = null, TblActions = null, OrderBy = null) {
        // COLUMNAS PERSONALIZADAS
        var colDefs = [];
        var FilterRows = 2;
        var RowGroup = null;
        var InitComplete = function (selector) {   
            var table = null;
            if (selector) {
                table = $(selector).dataTable();

            table.api().columns().every(function (index) {
                var column = this;
                if (Columns.Options) {
                    $.each(Columns.Options, async function (key, col) {

                        if (col.Target == index) {
                            var data = (col.Data) ? col.Data : null;
                            if (column.title().toLowerCase() == col.Name.toLowerCase()) {
                                $(`.kt-input[data-col-index="${parseInt(col.Target)}"`).empty().append(`<option value>SELECCIONE</option>`);
                                if (data && data.length > 0) {
                                    column.data().unique().sort().each(function (d, j) {
                                        var objs = data.find(o => o.Identifier.toString() === d.toString())
                                        if (objs)
                                            $(`.kt-input[data-col-index="${parseInt(col.Target)}"`).append(`<option value="${objs.Title}">${objs.Title}</option>`);
                                        else
                                            $(`.kt-input[data-col-index="${parseInt(col.Target)}"`).append(`<option value="${d}">${d}</option>`);
                                    });
                                }
                                else {
                                    column.data().unique().sort().each(function (d, j) {
                                       
                                        $(`.kt-input[data-col-index="${parseInt(col.Target)}"`).append(`<option value="${d}">${d}</option>`);
                                    });
                                }
                            }
                        }
                    });
                }
            });
            }

        }
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
        colDefs.push({
            targets: (OrderBy && OrderBy.NonOrderable) ? OrderBy.NonOrderable.split(",").map(Number) : null,
            orderable: false,
        });
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
                FilterRows++;
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
                })
                if (Columns.PredefinedRange.Active) {
                    FilterRows++;
                    $(`#${TblOpts.TableName}_wrapper div:first div:first `).after(`
                    <div class="col-sm-12 col-md-6">
                            <div class="dataTables_filter" id="${TblOpts.TableName}_PredefinedRange_filter">
                               <div class="row" >
                                <div class="col-md-4">
                                    <label style="margin-top:5px"> Rango de Fecha: </label>
                                </div>
                                <div class="col-md-8">
                                    <div class="input-group pull-right kt-daterangepicker-predefined">
                                        <input type="text" class="form-control "  data-col-index="${Columns.PredefinedRange.Target}" readonly placeholder="Seleccione Rango de Fecha" />
                                        <div class="input-group-append">
                                            <span class="input-group-text"><i class="la la-calendar-check-o"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>  
                        </div>
                    </div>`);
                    KTBootstrapDaterangepicker.init();
                    // BUSCAR EN LA TABLA AL SELECCIONAR                
                    $('.kt-daterangepicker-predefined').on('apply.daterangepicker', function (ev, picker) {

                        var start = `${picker.startDate._d.getDate()}-${picker.startDate._d.getMonth() + 1}-${picker.startDate._d.getFullYear()}`
                        var end = `${picker.endDate._d.getDate()}-${picker.endDate._d.getMonth() + 1}-${picker.endDate._d.getFullYear()}`
                        var range = GetDateRange(start, end);
                        $(`#${TblOpts.TableName}`).DataTable().column(Columns.PredefinedRange.Target).search(range ? range : '', true, true, true).draw();
                    });

                }
                // SELECT PARA FILTRAR POR COLUMNAS PERSONALIZADAS
                if (TblOpts && TblOpts.TableName) {
                    $(`#${TblOpts.TableName}_wrapper div:first div:first `).after(`
                    <div class="col-sm-12 col-md-6">
                            <div class="dataTables_filter" id="${TblOpts.TableName}_${col.Name.split(" ").join("")}_filter">
                               <div class="row" >
                                <div class="col-md-4">
                                    <label style="margin-top:5px"> ${col.Name}: </label>
                                </div>
                                <div class="col-md-8">
                                    <select data-col-index="${(col.Data.length == 0) ? col.Target : ""}"  class="form-control form-control-sm ${col.Data.length == 0 ? "kt-input" : ""}" id = "Sort${col.Name.split(" ").join("")}" >
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>  
                        </div>
                    </div>`);

                    // LLENAR SELECT CON VALORES DE LA TABLA
                    $.each(col.Data, function (key, val) {
                        $(`#${TblOpts.TableName}_wrapper div:first #${TblOpts.TableName}_${col.Name.split(" ").join("")}_filter select`)
                            .append(`<option value="${val.Title}">${val.Title}</option>`)
                    })
                    // BUSCAR EN LA TABLA AL SELECCIONAR
                    $(`#Sort${col.Name.split(" ").join("")}`).on('change', function () {
                        $(`#${TblOpts.TableName}`).DataTable().search($(this).val()).draw();
                    });
                    // SE DIVIDEN POR LA CANTIDAD DE DIV QUE HAYAN EN LA COLUMNA DE FILTROS QUE POR DEFAULT SON 2 PARA ORGANIZAR MEJOR LA COLUMNA
                    if ((Columns.Options.length - 1) == key) {
                        FilterRows = (12 / FilterRows);
                        $(`#${TblOpts.TableName}_wrapper div:first div.col-sm-12.col-md-6`).removeClass().addClass(`col-sm-12 col-md-${(Number.isInteger(FilterRows)) ? FilterRows : 4} `)
                    }
                }
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
            selector +=',.kt-table'
        }
       
        var table = await $(selector).DataTable({

            scrollX: (TblOpts && TblOpts.Scrollable) ? TblOpts.Scrollable.X : false,
            scrollY: (TblOpts && TblOpts.Scrollable) ? TblOpts.Scrollable.Y : "", //frecuentemente la desorganiza
            scrollCollapse: (TblOpts && TblOpts.Scrollable) ? TblOpts.Scrollable.ScrollColapse : false,
            rowGroup: RowGroup,
            responsive: false,
            paging: (TblOpts && TblOpts.Paginator) ? TblOpts.Paginator.Paging : true,
            info: (TblOpts) ? TblOpts.Paging : true,
            pageLength: (TblOpts && TblOpts.Paginator) ? TblOpts.Paginator.PageLength : 5,
            lengthMenu: [5, 10, 25, 50],
            autoWidth: true,
            language: {
                'lengthMenu': 'Mostrar  _MENU_',
            },
            search:
            {
                input: $('#generalSearch'),
                regex: true,
                caseInsensitive: true,
            },
            // Order settings

            order: [(OrderBy && OrderBy.DefaultOrder) ? OrderBy.DefaultOrder : 0, (OrderBy && OrderBy.Orientation) ? OrderBy.Orientation : "asc"],
            orderFixed: (TblOpts && TblOpts.RowGroup && TblOpts.RowGroup.FixedOrder && !isNaN(parseInt(TblOpts.RowGroup.FixedOrder.Target)))
                ? [TblOpts.RowGroup.FixedOrder.Target, TblOpts.RowGroup.FixedOrder.Orientation] : null,
            initComplete: function () {
                this.api().columns().every(function (index) {

                    var column = this;
                    if (Columns.Options) {
                        $.each(Columns.Options, async function (key, col) {

                            if (col.Target == index) {
                                var data = (col.Data) ? col.Data : null;
                                if (column.title().toLowerCase() == col.Name.toLowerCase()) {
                                    if (data && data.length > 0) {
                                        column.data().unique().sort().each(function (d, j) {
                                            var objs = data.find(o => o.Identifier.toString() === d.toString())
                                            if (objs)
                                                $(`.kt-input[data-col-index="${parseInt(col.Target)}"`).append(`<option value="${objs.Title}">${objs.Title}</option>`);
                                            else
                                                $(`.kt-input[data-col-index="${parseInt(col.Target)}"`).append(`<option value="${d}">${d}</option>`);
                                        });
                                    }
                                    else {
                                        column.data().unique().sort().each(function (d, j) {

                                            $(`.kt-input[data-col-index="${parseInt(col.Target)}"`).append(`<option value="${d}">${d}</option>`);
                                        });
                                    }
                                }
                            }
                        });
                    }
                })
            },

            columnDefs: colDefs,
             
        });
        var GetDateRange = function (start, end) {
            var FromDate = start.split("-");
            var ToDate = end.split("-");
            var arr = "";
            FromDate = new Date(`${FromDate[1]}-${FromDate[0]}-${FromDate[2]}`);
            ToDate = new Date(`${ToDate[1]}-${ToDate[0]}-${ToDate[2]}`);
            while (FromDate <= ToDate) {
                if (FromDate < ToDate) {
                    arr += (moment(FromDate).format('DD-MM-YYYY')) + '|'
                } else {
                    arr += (moment(FromDate).format('DD-MM-YYYY'))
                }
                FromDate.setDate(FromDate.getDate() + 1);
            }
            return arr;
        }
        // AGREGAR EVENTOS A LAS COLUMNAS PERSONALIZADAS DE EDICION Y ELIMINAR
        $(`${selector}`).on('draw.dt', async function () {
            //InitComplete(selector);
            table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var node = this.node();
                var row = this;
                var Id = (this).data()[((TblActions && TblActions.TargetId) ? TblActions.TargetId : 0)]
                var name = (TblOpts && TblOpts.TableName) ? TblOpts.TableName.replace("Tbl", "").replace("Table", "").replace("Tabla", "").replace("tabla", "") : null;
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
       
      
        //$('#kt_form_status').on('change', function () {
        //    datatable.search($(this).val().toLowerCase(), 'Estatus');
        //});

        //$('#kt_form_type').on('change', function () {
        //    datatable.search($(this).val().toLowerCase(), 'type');
        //});

        //$('#kt_form_status,#kt_form_type').selectpicker();
	};

    //[
    //    {
    //        targets: (IsOptionEnabled) ? -1 : null,
    //        //title: 'Opciones',
    //        orderable: false,
    //        render: function (data, type, full, meta) {
    //            if (IsOptionEnabled) {
    //                return `
    //                        <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar" id="TblAction1">
    //                            <i class="la la-edit"></i>
    //                        </a>
    //                       <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Eliminar" id="TblAction2">
    //                            <i class="la la-trash"></i>
    //                        </a>
    //                       <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Imprimir Acuse" id="TblAction3">
    //                            <i class="la la-print"></i>
    //                        </a>
    //                        `
    //                    ;
    //            } else { return null; }
    //        },
    //        orderable: false
    //    },
    //    {
    //        targets: StatusCol,
    //        render: function (data, type, full, meta) {
    //            //$.get(UrlEstatus, null, function (Datos) {
    //            //    var test = {};
    //            //    for (var i = 0; i < Datos.length; i++) {
    //            //        test[i] = { 'title': Datos[i].DescripcionEstatus, 'class': 'kt-badge--metal' };
    //            //    }
    //            //    console.log(test);
    //            //});
    //            var status = {
    //                1: { 'title': 'Pendiente', 'class': 'kt-badge--metal' },
    //                2: { 'title': 'Recibido', 'class': ' kt-badge--brand' },
    //                3: { 'title': 'Canceled', 'class': ' kt-badge--primary' },
    //                4: { 'title': 'Success', 'class': ' kt-badge--success' },
    //                5: { 'title': 'Info', 'class': ' kt-badge--info' },
    //                6: { 'title': 'Danger', 'class': ' kt-badge--danger' },
    //                7: { 'title': 'Warning', 'class': ' kt-badge--warning' },
    //            };
    //            //console.log(status);
    //            if (typeof status[data] === 'undefined') {
    //                return data;
    //            }
    //            return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
    //        },
    //    },
    //    {
    //        targets: (isNaN(TipoCol)) ? null : TipoCol,
    //        render: function (data, type, full, meta) {
    //            var status = {
    //                1: { 'title': 'Documentos', 'state': 'primary' },
    //                2: { 'title': 'Valija', 'state': 'danger' },
    //                3: { 'title': 'Equipos Tecnologicos', 'state': 'accent' },
    //                4: { 'title': 'Otros', 'state': 'brand' },
    //            };
    //            if (typeof status[data] === 'undefined') {
    //                return data;
    //            }
    //            return '<span class="kt-badge kt-badge--' + status[data].state + ' kt-badge--dot"></span>&nbsp;' +
    //                '<span class="kt-font-bold kt-font-' + status[data].state + '">' + status[data].title + '</span>';
    //        },
    //    },
    //],
	//var initTable2 = function() {
	//	var table = $('#m_table_2');

	//	// begin second table
	//	table.DataTable({
	//		scrollY: '50vh',
	//		scrollX: true,
	//		scrollCollapse: true,
	//		createdRow: function(row, data, index) {
	//			var status = {
	//				1: {'title': 'Pending', 'class': 'kt-badge--brand'},
	//				2: {'title': 'Delivered', 'class': ' kt-badge--metal'},
	//				3: {'title': 'Canceled', 'class': ' kt-badge--primary'},
	//				4: {'title': 'Success', 'class': ' kt-badge--success'},
	//				5: {'title': 'Info', 'class': ' kt-badge--info'},
	//				6: {'title': 'Danger', 'class': ' kt-badge--danger'},
	//				7: {'title': 'Warning', 'class': ' kt-badge--warning'},
	//			};
	//			var badge = '<span class="kt-badge ' + status[data[18]].class + ' kt-badge--inline kt-badge--pill">' + status[data[18]].title + '</span>';
	//			row.getElementsByTagName('td')[18].innerHTML = badge;

	//			status = {
	//				1: {'title': 'Online', 'state': 'danger'},
	//				2: {'title': 'Retail', 'state': 'primary'},
	//				3: {'title': 'Direct', 'state': 'accent'},
	//			};
	//			badge = '<span class="kt-badge kt-badge--' + status[data[19]].state + ' kt-badge--dot"></span>&nbsp;' +
	//				'<span class="kt-font-bold kt-font-' + status[data[19]].state + '">' + status[data[19]].title + '</span>';
	//			row.getElementsByTagName('td')[19].innerHTML = badge;
	//		},
	//		columnDefs: [
	//			{
	//				targets: -1,
	//				title: 'Actions',
	//				orderable: false,
	//				render: function(data, type, full, meta) {
	//					return `
 //                       <span class="dropdown">
 //                           <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
 //                             <i class="la la-ellipsis-h"></i>
 //                           </a>
 //                           <div class="dropdown-menu dropdown-menu-right">
 //                               <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>
 //                               <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>
 //                               <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>
 //                           </div>
 //                       </span>
 //                       <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
 //                         <i class="la la-edit"></i>
 //                       </a>`;
	//				},
	//			}],
	//	});
	//};

	return {

		//main function to initiate the module
        init: function (TblOpts, Columns, TblActions, OrderBy ) {
            initTable1(TblOpts, Columns, TblActions, OrderBy);
			//initTable2();
		}
	};
}();

jQuery(document).ready(function() {
	//KTDatatablesBasicScrollable.init();
});
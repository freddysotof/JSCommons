   const InitTableBasicAsync = async (tblOptions, columnOptions, tblActions, tblOrder) => {
            //debugger
            if (!tblOptions)
                tblOptions = new TableOptions();
            if (!columnOptions)
                columnOptions = new ColumnOption();
            if (!tblActions)
                tblActions = new TableActions();
            if (!tblOrder)
                tblOrder = new TableOrder();
            var t = $(`#${tblOptions.TableName},.${tblOptions.TableName}`);
                if (await $.fn.DataTable.isDataTable(t)) {
                    $(t).DataTable().destroy();
                    $('tbody', t).empty();
                }
            await KTDatatablesBasicBasic.init(tblOptions, columnOptions, tblActions, tblOrder);
            t = t.dataTable().api();
            return t;
        }
        const InitTableScrollableAsync = async (tblOptions, columnOptions, tblActions, tblOrder) => {
            if (!tblOptions)
                tblOptions = new TableOptions();
            if (!columnOptions)
                columnOptions = new ColumnOption();
            if (!tblActions)
                tblActions = new TableActions();
            if (!tblOrder)
                tblOrder = new TableOrder();
            var t = $(`#${tblOptions.TableName},.${tblOptions.TableName}`);
            if (await $.fn.DataTable.isDataTable(t)) {
                $(t).DataTable().destroy();
                $('tbody', t).empty();
            }
            await KTDatatablesBasicScrollable.init(tblOptions, columnOptions, tblActions, tblOrder);
            t = t.dataTable().api();
            return t;
        }
        const InitTableSearchOptionsAsync = async (tblOptions, columnOptions, tblActions, tblOrder) => {
            if (!tblOptions)
                tblOptions = new TableOptions();
            if (!columnOptions)
                columnOptions = new ColumnOption();
            if (!tblActions)
                tblActions = new TableActions();
            if (!tblOrder)
                tblOrder = new TableOrder();
            var t = $(`#${tblOptions.TableName},.${tblOptions.TableName}`);
            if (await $.fn.DataTable.isDataTable(t)) {
                $(t).DataTable().destroy();
                $('tbody', t).empty();
            }
            await KTDatatablesSearchOptionsAdvancedSearch.init(tblOptions, columnOptions, tblActions, tblOrder);
            t = t.dataTable().api();
            return t;
        }
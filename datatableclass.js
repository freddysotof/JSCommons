class TableOptions {
    //tableName:string Nombre del id de Tabla
    //paginator: paging:bool - mostrar paginado, PageLenght: cnatidad de registros a mostrar por pagina
    //scrollable: X:bool scroll bar horizonta, Y:string scrollbarVertical tamaño. Ej: "20em", 
    //ScrollColape: bool al cambiar de pagina si se mantendra el mismo tamaño aunque sean menos registros
    //colWidth:array asignar tamaño de columnas
    //rowGroup: Si se dividira la tabla por grupos
    //FixeORder:{Target:int, Orientation:string} Se utiliza en caso de que se agrupe por columnas para determinar si cuando se reordene se reordene especialmente por grupos o por registros
    constructor(tableName = null, paginator = { Paging: true, PageLength: 5 },
        scrollable = { X: false, Y: "", ScrollColapse: false }, colWidth = []) {
        this.TableName = (tableName) ? tableName : "kt-table";
        this.Paginator = paginator
        this.Scrollable = scrollable
        this.RowGroup = {
            Start: {
                BgColor: null, Color: null, Cols: []
            },
            End: {
                BgColor: null, Color: null, Cols: []
            },
            Target: null,
            Color: 'white',
            FixedOrder: { Target: null, Orientation: "" }
        };
        this.ColWidth = colWidth;
    }
    //target:int de la columnas por el cual se va a agrupar
    //orientarion:string orientacion ('asc','desc')
    SetFixedOrder(target = null, orientation = "asc") {
        this.RowGroup.FixedOrder.Target = target;
        this.RowGroup.FixedOrder.Orientation = orientation;
    }
    //rowGroupType:string Tipo de RowGroup al Start o al End 
    //Id:string Identificador en el DOM
    //Target:int Especifica si es una sumatoria de cual columna se sumaran los datos
    //title:string titulo
    //state:string estado de la plantilla (metal,brand,etc)
    //type:string tipo de la sumatoria: Si se mostrara el total de un monto, ponemos "money" si queremos mostrar el total de una cantidad ponemos "int"
    //data: Valor que se quiera mostrar adicional en el DOM
    //html: formato en que como se visualizara la data en el dom, teniendo en cuenta que se deben utilizar los parametros anteriores si queremos que se visualicen en el dom
    //MUY IMPORTANTE DE HTML: si queremos que se visualice el valor por el cual se esta diviendo la tabla en grupos debemos anexar en el html {group}  donde queremos que se visualice
    // Por igual si queremos que se visualice el total de la sumatoria del target debemos poner {total}
    //EJ DE html: 'La cantidad de {group} es de: {total} y {data}
    static rowGroupType = {
        Start: 'start',
        End: 'end'
    }
    InsertRowGroupCols(rowGroupType, id, target, title, state = null, html, type = 'int', color = null, data = null) {
        switch (rowGroupType) {
            case TableOptions.rowGroupType.Start:
                this.RowGroup.Start.Cols.push(
                    {
                        Id: id,
                        Target: target,
                        Title: title,
                        State: state,
                        Html: html,
                        Type: type,
                        Color: color,
                        Data: data
                    })
                break;
            case TableOptions.rowGroupType.End:
                this.RowGroup.End.Cols.push(
                    {
                        Id: id,
                        Target: target,
                        Title: title,
                        State: state,
                        Html: html,
                        Type: type,
                        Data: data
                    })
                break;

        }
    }
    //targets:string separated by comma ('1,2,3,4') columnas que tomaran el ancho
    //width: ancho de la columnas
    //classname: clase adicional prefireblemente del datatable
    InsertColWidth(targets, width, classname = null) {
        this.ColWidth.push(
            {
                Targets: targets,
                Width: width,
                Class: classname
            })
    }

}

class ColumnOption {
    //PredefinedRange:bool Especificara si querra que exista un filtro para buscar entre fecha de dias seleccionados (hoy,ayer,hace 7 dias)
    constructor() {
        this.Options = [];
        this.PredefinedRange = { Active: false, Target: null }
    }
    //name:string/int Nombre o valor de la Opcion
    //target:int En que columna 
    //width:int ancho de la columna
    //html:string Formato en el DOM. Se deben poner las etiquetas {title} donde se quiera poner el titulo y {state} en caso de querer darle el estilo de states
    //classname:string alguna clase adicional del datatable
    //Data:array Se guardaran los diferente valores
    //IMPORTANTE: EN CASO DE USAR EL ADVANCED SEARCH Y QUERER QUE SE LLENE LOS SELECT DE LOS FILTROS CON EL DATA-COL-INDEX, debe agregar las opciones de cada select,
    //simplemente el name y el target. OJO: El target asignado a la opcion debe ser 
    InsertOption(name = null, target = null, width = null, html = "", className = null, isIdentifierValue = false, IdentifierTarget = target, data = []) {
        this.Options.push({
            Html: html,
            Name: name,
            Target: target,
            Width: width,
            Class: className,
            IsIdentifierValue: isIdentifierValue,
            Data: [],

        });
    }
    //index:int posicion del array de Options
    //identifier:int/string identificador por el cual se sustituira en la tabla. Ej: IdEstatus:1 = Pendiente
    //title:string Titulo por el cual se sustituira. Ek: Pendiente
    //state:string Estado de la plantilla en caso de ser utilizado en el Html de la opcion
    InsertOptionData(index, identifier, title, state) {
        this.Options[index].Data.push({
            Identifier: identifier,
            Title: title,
            State: state
        })

    }
    static SimpleTitle = `{title}`;
    static BadgeDotTitleTemplate = `<span class="kt-badge kt-badge--{state} kt-badge--dot"></span>&nbsp;
    <span class="kt-font-bold kt-font-{state}">{title}</span>`;
    static BadgePillDataTemplate = `<span class="kt-badge  kt-badge--{state} kt-badge--inline kt-badge--pill">{data}</span>`;
    static BadgePillTitleTemplate = `<span class="kt-badge  kt-badge--{state}  kt-badge--inline kt-badge--pill">{title}</span>`;
    static BadgeGroupTitleTemplate = `&nbsp;&nbsp; <span class=" kt-badge kt-badge--lg  kt-badge--{state}">{group}</span> &nbsp;&nbsp; {title}`
    static BadgeGroupTitleSmallTemplate = `&nbsp;&nbsp; <span class="kt-badge kt-badge--lg kt-badge--{state} text-center" style="font-size:14px">{data}</span> &nbsp;&nbsp; {title}`
    static RowGroupTitleTemplate = `{title} : {group}`;
    static RowGroupTotalTemplate = `<strong>Total {title} {group}: {total}</strong>`;
    SetPredefinedRange(active, target) {
        this.PredefinedRange.Active = active;
        this.PredefinedRange.Target = target;
    }
}


class TableActions {
    //width:int ancho de la columna
    //actionCol:int en que columna se van a desplegar las opciones
    //targetId: int De que columna se tomara el id (de la columna 0 por ej) para asignarselo al Id de la celda
    constructor(width = null, actionCol = null, targetId = null, buttons = []) {
        this.Buttons = buttons;
        this.Width = width;
        this.ActionCol = actionCol;
        this.TargetId = targetId;
    }
    //title:string titulo del boton
    //icon:string icono del boton
    //onclick:string nombre del metodo del boton sin parametros. Ej: Guardar
    //targets:string separated by comma ('1,2,3,4') los parametros que tomara el metodo en click de las diferentes columnas. Ej columna del id, columna del tipo
    //type:string que tipo de etiqueta sera. Generalmente es 'a' o 'button'
    //classname:string alguna clase especial que quiera asignarle especialmente del datatable
    //attr: atributos opcionales style,etc.
    InsertButton(title, icon, onclick, targets, type, classname, attr,isIcon=true,href=null) {
        this.Buttons.push(
            { Title: title, Icon: icon, OnClick: onclick, Targets: targets, Type: type, Class: classname, Attr: attr, IsIcon: isIcon, Href: href }
        )
    }
}

class TableFooter {
    //RowSum:array Se guardaran todas las filas que seran de sumatoria entre columnas
    //RowInfo:array Se guardaran todas las filas que seran de informacion en el footer
    constructor() {
        this.RowSum = []
        this.RowInfo = []
    }
    //id:string Identificador en el DOM
    //rowPositions:number array [0,1]
    //title:string Titulo de la fila en el footer
    //type:string tipo de la sumatoria: Si se mostrara el total de un monto, ponemos "money" si queremos mostrar el total de una cantidad ponemos "int"
    InsertRowSum(id, rowPositions, title, type) {
        this.RowSum.push(
            { Id: id, RowPositions: rowPositions, Title: title, Type: type }
        );
    }
    //id:string Identificador en el DOM
    //title:string Titulo en el DOM del footer
    //data:string/int Data que se quiere mostrar
    //state:string estado de la plantilla en caso de ser utilizado
    //html:string Formato en el DOM. Se deben poner las etiquetas {title} donde se quiera poner el titulo y {state} en caso de querer darle el estilo de states
    InsertRowInfo(id, title, data, state, html) {
        this.RowInfo.push(
            { Id: id, Title: title, Data: data, State: state, Html: html }
        );
    }
}

class TableOrder {
    //defaultOrder: int Por que columna se va a ordenar
    //Orientation: String ('asc','desc')
    //nonOrderable: string separated by comma ('1,2,3,4') columnas que no se permitira ordenar
    //nonVisible: string separated by comma ('1,2,3,4') columnas que no se van a mostrar
    constructor(defaultOrder = null, orientation = null, nonOrderable = null, nonVisible = null) {
        this.DefaultOrder = defaultOrder;
        this.Orientation = orientation;
        this.NonOrderable = nonOrderable;
        this.NonVisible = nonVisible;
    }
}


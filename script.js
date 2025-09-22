const ProductsLookup = function(value = null, callback = null) {

    // Create a Modal
    builder.Component(
        "modal",
        {
            onEnter: false,
            destroy:true,
            icon: "search",
            title: builder.Locale.get("Find a Product"),
            cancel: false,
            submit: true,
            size: "md",
            callback: {
                submit: function(element,modal){

                    // Create a spinner animate-rotate
                    var spinner = $(document.createElement('div')).attr({
                        "class": "animate-rotate rounded-circle border border-secondary border-4 d-none",
                        "style": "width: 96px; height: 96px; border-top-color: var(--bs-primary)!important;",
                    }).appendTo(element);

                    // Hide the dialog
                    element.dialog.addClass('opacity-0');

                    // Setup a spinner while waiting for the modal to be submitted
                    setTimeout(() => {

                        // Hide the dialog
                        element.dialog.hide();

                        // Add flex to the modal
                        element.addClass('d-flex align-items-center justify-content-center');

                        // Show the spinner
                        spinner.removeClass('d-none');

                        // Submit the form
                        element.form.submit();
                    }, 300);

                },
            },
        },
        function(modal,component){
            const componentModal = component;
            component.addClass('modal-primary');
            component.footer.submit
                .addClass('btn-primary')
                .removeClass('btn-link')
                .text(builder.Locale.get('Search'))
                .attr('style','border-bottom-left-radius: var(--bs-modal-inner-border-radius) !important;border-bottom-right-radius: var(--bs-modal-inner-border-radius) !important;');
            component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-search me-1').prependTo(component.footer.submit);
            component.form = builder.Component(
                "form",
                component.body,
                {
                    callback:{
                        submit: function(form){
                            // AJAX Request
                            API.endpoint('/products/fetchAll').data({
                                conditions: [
                                    {key: 'sku', operator: '=', value: form.val('query')},
                                    {key: 'upc', operator: '=', value: form.val('query')},
                                    {key: 'name', operator: 'LIKE', value: '%'+form.val('query')+'%'},
                                    {key: 'description', operator: 'LIKE', value: '%'+form.val('query')+'%'},
                                    {key: 'type', operator: 'LIKE', value: '%'+form.val('query')+'%'},
                                    {key: 'supplier', operator: 'LIKE', value: '%'+form.val('query')+'%'},
                                    {key: 'brand', operator: 'LIKE', value: '%'+form.val('query')+'%'},
                                ],
                                conjunction: 'OR',
                            }).execute(function(response){

                                // If a callback is provided, call it with the response
                                if (typeof callback === 'function') {
                                    callback(response.records);
                                }

                                // Close the modal
                                modal.hide();
                            },function(xhr, status, error){
                                modal.hide();
                            });
                        },
                    },
                },
                function(form,component){

                    // Add a text input for the query
                    form.add(
                        {
                            name: 'query',
                            label: builder.Locale.get('Search'),
                            icon: 'search',
                            type: 'text',
                            value: value,
                        },
                    );

                    // Check if a value is provided
                    if (value) {

                        // Trigger the submit event
                        form.submit();
                    } else {

                        // Show the modal
                        modal.show();
                    }
                },
            );
        }
    );
}
const ProductsSelect = function(products, callback = null) {

    // Create a Modal
    builder.Component(
        "modal",
        {
            onEnter: false,
            destroy:true,
            icon: "check2-square",
            title: builder.Locale.get("Select a Product"),
            cancel: false,
            submit: true,
            size: "lg",
            callback: {
                submit: function(element,modal){

                    // Create a spinner animate-rotate
                    var spinner = $(document.createElement('div')).attr({
                        "class": "animate-rotate rounded-circle border border-secondary border-4 d-none",
                        "style": "width: 96px; height: 96px; border-top-color: var(--bs-primary)!important;",
                    }).appendTo(element);

                    // Hide the dialog
                    element.dialog.addClass('opacity-0');

                    // Setup a spinner while waiting for the modal to be submitted
                    setTimeout(() => {

                        // Hide the dialog
                        element.dialog.hide();

                        // Add flex to the modal
                        element.addClass('d-flex align-items-center justify-content-center');

                        // Show the spinner
                        spinner.removeClass('d-none');

                        // Submit the form
                        element.form.submit();
                    }, 300);

                },
            },
        },
        function(modal,component){
            const componentModal = component;
            component.addClass('modal-primary');
            component.footer.submit
                .addClass('btn-success')
                .removeClass('btn-link')
                .text(builder.Locale.get('Add'))
                .attr('style','border-bottom-left-radius: var(--bs-modal-inner-border-radius) !important;border-bottom-right-radius: var(--bs-modal-inner-border-radius) !important;');
            component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-plus-lg me-1').prependTo(component.footer.submit);
            component.form = builder.Component(
                "form",
                component.body,
                {
                    callback:{
                        val: function(values){
                            for(const [key, value] of Object.entries(values)){
                                switch(key){
                                    case 'price': values[key] = parseFloat(value); break;
                                    case 'rate': values[key] = (parseFloat(value) / 100); break;
                                    default: values[key] = parseInt(value); break;
                                }
                            }
                            return values;
                        },
                        submit: function(form){

                            // Execute the callback
                            if (typeof callback === 'function') {
                                callback(form.val());
                            }

                            // Close the modal
                            modal.hide();
                        },
                    },
                },
                function(form,component){

                    // Generate a list of products
                    var options = [];
                    for(const [key, product] of Object.entries(products)){
                        options.push({id: product.id, text: product.type + ' | ' + product.name + '(' + product.sku + ')' + ' - ' + product.description})
                    }

                    // Add a text input for the qty
                    form.add(
                        {
                            name: 'qty',
                            label: builder.Locale.get('QTY'),
                            icon: 'hash',
                            type: 'number',
                            value: 1,
                        },
                    );

                    // Add a select input for the product
                    form.add(
                        {
                            name: 'id',
                            label: builder.Locale.get('Product'),
                            icon: 'box-seam',
                            type: 'select2',
                            modal: componentModal,
                            options: options,
                            callback: {
                                onChange: function(input, form){
                                    let values = form.val();
                                    let product = products[values.id];
                                    form.val({'rate': product[product.inColumn]});
                                },
                            },
                        },
                        function(input){
                            input.addClass('mt-3');
                        }
                    );

                    // Add a float input for the price/rate
                    form.add(
                        {
                            name: 'rate',
                            label: builder.Locale.get('Price/Rate'),
                            icon: 'currency-dollar',
                            type: 'number',
                            callback: {
                                onChange: function(input){
                                    let values = form.val();
                                    let product = products[values.id];
                                    let name = builder.Locale.get(product.inColumn.charAt(0).toUpperCase() + product.inColumn.slice(1));
                                    let icon = product.inColumn === 'rate' ? 'bi bi-percent' : 'bi bi-currency-dollar';
                                    input.label.html('<i class="bi bi-'+icon+' me-1"></i>'+name);
                                },
                            },
                        },
                        function(input){
                            console.log(input);
                            input.addClass('mt-3');
                            input.input.attr('step', '0.01');
                            input.input.attr('min', '0');
                        }
                    );

                    // Show the modal
                    modal.show();
                },
            );
        }
    );
}

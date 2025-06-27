<?php

/**
 * Core Framework - ProductsEndpoint
 *
 * @license    MIT (https://mit-license.org/)
 * @author     Louis Ouellet <louis@laswitchtech.com>
 */

// Import additionnal class into the global namespace
use \LaswitchTech\Core\Abstracts\Endpoint;

class ProductsEndpoint extends Endpoint {

    /**
     * Constructor
     */
    public function __construct()
    {

        // Call Parent Constructor
        parent::__construct();

        // Retrieve the namespace
        $namespace = $this->Request->getNamespace();

        // Set Global access
        $this->Public = false;

        // Set Level
        switch($namespace){
            case "/products/fetchAll":
            case "/products/fetch":
                $this->Level = 1;
                break;
            case "/products/create":
                $this->Level = 2;
                break;
            case "/products/update":
                $this->Level = 3;
                break;
            case "/products/archive":
            case "/products/recover":
                $this->Level = 4;
                break;
        }
    }

    /**
     * Retrieve Products
     */
    public function fetchAllAction(): array
    {
        // Set the default message
        $message = ["status" => 200, "message" => "OK", "data" => []];

        // Retrieve the conditions
        $conditions = $this->Request->getParams('REQUEST','conditions') ?? [];

        // Retrieve the conjunction
        $conjunction = $this->Request->getParams('REQUEST','conjunction') ?? 'AND';

        // Check if the products is accessible
        if($message['status'] == 200){

            // Check the request method
            if($this->Request->getMethod() == "POST"){

                // Retrieve the products records
                $message['data']['records'] = $this->Model->Products->fetchAll($conditions, $conjunction);
            } else {
                $message = ["status" => 405, "message" => "Method Not Allowed", "data" => "The method is not allowed for the requested URL."];
            }
        }
        return $message;
    }
}

<?php

namespace NeuralNetwork\Tests;

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;

class PlayerTest extends TestCase
{
    private $http;

    public function setUp()
    {
        $baseURL = $_ENV["baseURL"];
        $this->http = new Client(['base_uri' => "http://${baseURL}/server/"]);
    }

    public function testGet()
    {
        $response = $this->http->request('GET', 'players',[
            'query' => [
                'k' => '20835'
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());

        $contentType = $response->getHeaders()["Content-Type"][0];
        $this->assertEquals("application/json", $contentType);
    }

    public function tearDown() {
        $this->http = null;
    }
}

<?php

    $file = "../../jdfv76xdfv7.html";

    if (file_exists($file)) {
        unlink($file);
    }else {
        header("HTTP/1.0 400 BadRequest");
    }

?>
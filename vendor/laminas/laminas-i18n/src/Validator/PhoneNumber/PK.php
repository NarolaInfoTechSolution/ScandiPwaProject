<?php

/**
 * @see       https://github.com/laminas/laminas-i18n for the canonical source repository
 * @copyright https://github.com/laminas/laminas-i18n/blob/master/COPYRIGHT.md
 * @license   https://github.com/laminas/laminas-i18n/blob/master/LICENSE.md New BSD License
 */

return [
    'code' => '92',
    'patterns' => [
        'national' => [
            'general' => '/^(?:1\\d{8}|[2-8]\\d{5,11}|9(?:[013-9]\\d{4,9}|2\\d(?:111\\d{6}|\\d{3,7})))$/',
            'fixed' => '/^(?:(?:21|42)[2-9]\\d{7}|(?:2[25]|4[0146-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]\\d{6}|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:1|2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8]))[2-9]\\d{5,6}|58[126]\\d{7})$/',
            'mobile' => '/^3(?:0\\d|1[1-5]|2[0-5]|3[1-6]|4[1-7]|55|64)\\d{7}$/',
            'tollfree' => '/^800\\d{5}$/',
            'premium' => '/^900\\d{5}$/',
            'personal' => '/^122\\d{6}$/',
            'uan' => '/^(?:2(?:[125]|3[2358]|4[2-4]|9[2-8])|4(?:[0-246-9]|5[3479])|5(?:[1-35-7]|4[2-467])|6(?:[1-8]|0[468])|7(?:[14]|2[236])|8(?:[16]|2[2-689]|3[23578]|4[3478]|5[2356])|9(?:1|22|3[27-9]|4[2-6]|6[3569]|9[2-7]))111\\d{6}$/',
            'emergency' => '/^1(?:1(?:22?|5)|[56])$/',
        ],
        'possible' => [
            'general' => '/^\\d{6,12}$/',
            'fixed' => '/^\\d{6,10}$/',
            'mobile' => '/^\\d{10}$/',
            'tollfree' => '/^\\d{8}$/',
            'premium' => '/^\\d{8}$/',
            'personal' => '/^\\d{9}$/',
            'uan' => '/^\\d{11,12}$/',
            'emergency' => '/^\\d{2,4}$/',
        ],
    ],
];

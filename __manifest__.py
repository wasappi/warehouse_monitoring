# -*- coding: utf-8 -*-
{
    'name': 'Weather Station',
    'version': '1.0',
    'summary': 'Weather Station Management',
    'category': 'IoT',
    'author': 'Lionel Bauwin',
    'license': 'LGPL-3',
    'depends': ['base', 'mail'],
    'installable': True,
    'application': True,
    'data': [
        'security/res_groups.xml',
        'security/ir.model.access.csv',
        # views
        'views/weather_measures_views.xml',
        'views/weather_station_menus.xml',
    ],
    'demo': [
        'demo/demo.xml',
    ],
}

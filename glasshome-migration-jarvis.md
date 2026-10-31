# GlassHome: Übernahme aus dem J.A.R.V.I.S.-Dashboard

GlassHome ist eine eigene App (Add-on `9904ebc2_glasshome`, Port 3123). Es nutzt **keine
Lovelace-Konfiguration**. Dashboards werden in der GlassHome-Oberfläche per Drag & Drop gebaut und im
Add-on gespeichert. Die J.A.R.V.I.S.-Karten (`custom:jarvis-tile`, `custom:frankys-climate-ui-card`,
die Markdown-Header und das CSS) lassen sich deshalb nicht 1:1 importieren. Diese Liste ist die Vorlage,
um sie in GlassHome nachzubauen.

## Einrichtung

1. `http://<HA-IP>:3123` öffnen und mit Home Assistant verbinden (Long-Lived-Access-Token).
2. **Theme:** Ein dunkles Theme wählen, das dem J.A.R.V.I.S.-Look am nächsten kommt
   (Navy/Glas, Neon-Cyan `#18dfff`, Glut-Orange `#ff7d25`). Zum Beispiel *Midnight Glass* (dunkel)
   oder *Retrowave*.
3. Für jeden Raum unten ein Raum-Dashboard anlegen. GlassHome ordnet nach HA-Bereichen.

## Übersicht / Beleuchtung

- Ganze Wohnung: `light.zuhause`
- Lichtszenen: `input_select.szenen_raum`, `select.wohnzimmer_wohnzimmer_szene`, `select.kuche_kuche_szene`,
  `select.schlafzimmer_schlafzimmer_szene`, `select.wellizimmer_wellizimmer_szene`,
  `select.badezimmer_badezimmer_szene`, `select.flur_flur_szene`

## Heizung (allgemein)

- Urlaubsmodus: `input_boolean.urlaub`. Ein = alle Heizungen auf 16 °C, Aus = zurück zum tado-Zeitplan.
- tado Zuhause: `sensor.zuhause_aussentemperatur`, `sensor.zuhause_solarprozentsatz`, `sensor.zuhause_wetterlage`,
  `sensor.zuhause_tado_modus`, `sensor.zuhause_geofencing_modus`, `sensor.zuhause_automatisches_geofencing`

## Wohnzimmer
- Licht: `light.wohnzimmer_wohnzimmer` (alle), `light.wohnzimmer` (Hue-Zone), `light.wohnzimmer_hue_iris_1`,
  `light.wohnzimmer_wz_decke_1`, `light.wohnzimmer_wz_decke_2`, `light.wohnzimmer_wz_decke_3`, `light.wohnzimmer_wz_tisch`
- Heizung: `climate.wohnzimmer_wohnzimmer` (Temperatur-Sensor `sensor.hygrometer_wohnzimmer_temperatur`)
- Klima: `sensor.hygrometer_wohnzimmer_temperatur`, `sensor.hygrometer_wohnzimmer_luftfeuchtigkeit`,
  `sensor.wohnzimmer_wohnzimmer_temperatur`, `sensor.wohnzimmer_wohnzimmer_luftfeuchtigkeit`, `sensor.wohnzimmer_buro_temperatur`
- Medien: `media_player.fernseher_2`, `media_player.fernseher`, `media_player.fernseher_gq65s85daexzg`,
  `media_player.wohnzimmer_sascha_s_2024_samsung_smart_qled_tv_w_far_field_voice`, `media_player.wohnzimmer`
- Sicherheit: `binary_sensor.wohnzimmer_buro_bewegung`, `binary_sensor.hitzemelder_2_alarmstatus`
- Geräte: `event.wohnzimmer_dimmer_wohnzimmer_taste_1`, `switch.fritz_box_7590_ax_wi_fi_main_2_4ghz`,
  `sensor.fritz_box_7590_ax_externe_ip_2`, `switch.hue_bridge_automation_welli_4`,
  `sensor.internetgatewaydevicev2_fritz_box_7590_ax_externe_ip`, `device_tracker.ipad`, `binary_sensor.va1048399872_batteriestand`

## Küche
- Licht: `light.kuche_kuche` (alle), `light.kuche_kuche_decke_1`, `light.kuche_kuche_spot_1`, `light.kuche_kuche_spot_2`, `light.kuche_kuche_spot_3`
- Klima: `sensor.hygrometer_kuche_temperatur`, `sensor.hygrometer_kuche_luftfeuchtigkeit`, `sensor.echo_kuche_temperatur`
- Medien: `media_player.echo_kuche`
- Sicherheit: `binary_sensor.hitzemelder_alarmstatus`
- Geräte: `device_tracker.bosch_fridgefreezer_244080537782001504`, `sensor.mealie_rezepte`,
  `device_tracker.neff_oven_305090427024000226`, `select.sascha_bohatsch_gmx_net_standardgerat`,
  `device_tracker.siemens_dishwasher_015090396724000714`

## Schlafzimmer
- Licht: `light.schlafzimmer_schlafzimmer` (alle), `light.schlafzimmer_schlafzimmer_1`, `light.schlafzimmer_schlafzimmer_2`
- Heizung: `climate.schlafzimmer_schlafzimmer`
- Klima: `sensor.hygrometer_schlafzimmer_temperatur`, `sensor.hygrometer_schlafzimmer_luftfeuchtigkeit`,
  `sensor.schlafzimmer_schlafzimmer_temperatur`, `sensor.schlafzimmer_schlafzimmer_luftfeuchtigkeit`, `sensor.alexa_schlafzimmer_temperatur`
- Medien: `media_player.alexa_schlafzimmer`
- Geräte: `binary_sensor.va1384009728_batteriestand`

## Kinderzimmer
- Licht: `light.kinderzimmer_kinderzimmer` (alle), `light.kinderzimmer_deckenlampe_1`, `light.kinderzimmer_deckenlampe_2`,
  `light.kinderzimmer_kinderzimmer_1`, `light.kinderzimmer_kinderzimmer_2`, `light.kinderzimmer_kinderzimmer_3`
- Heizung: `climate.kinderzimmer_kinderzimmer`
- Klima: `sensor.hygrometer_kinderzimmer_temperatur`, `sensor.hygrometer_kinderzimmer_luftfeuchtigkeit`,
  `sensor.kinderzimmer_kinderzimmer_temperatur`, `sensor.kinderzimmer_kinderzimmer_luftfeuchtigkeit`
- Geräte: `event.kinderzimmer_dimmer_kinderzimmer_taste_2`, `binary_sensor.va2760002048_batteriestand`

## Wellizimmer
- Licht: `light.wellizimmer_wellizimmer` (alle), `light.wellizimmer_buro_1`, `light.wellizimmer_buro_2`, `light.wellizimmer_buro3`
- Heizung: `climate.wellizimmer_wellizimmer`
- Klima: `sensor.hygrometer_wellizimmer_temperatur`, `sensor.hygrometer_wellizimmer_luftfeuchtigkeit`,
  `sensor.wellizimmer_wellizimmer_temperatur`, `sensor.wellizimmer_wellizimmer_luftfeuchtigkeit`
- Medien: `media_player.saschas_echo_show`
- Reinigung: `vacuum.wilma_ii`
- Geräte: `device_tracker.echoshow_73729150a0ad8c21`, `sensor.wellizimmer_schalter_wellizimmer_batterie`,
  `binary_sensor.va1786597376_batteriestand`, `switch.wilma_ii_dock_kindersicherung`

## Badezimmer
- Licht: `light.badezimmer_badezimmer` (alle), `light.badezimmer_badezimmer_1`, `light.badezimmer_badezimmer_2`
- Heizung: `climate.badezimmer_badezimmer`
- Klima: `sensor.hygrometer_badezimmer_temperatur`, `sensor.hygrometer_badezimmer_luftfeuchtigkeit`,
  `sensor.badezimmer_badezimmer_temperatur`, `sensor.badezimmer_badezimmer_luftfeuchtigkeit`, `sensor.saschas_4_echo_dot_bad_temperatur`
- Medien: `media_player.saschas_4_echo_dot_bad`
- Geräte: `binary_sensor.va3363196928_batteriestand`

## Flur
- Licht: `light.flur_flur` (alle), `light.flur_flur_4`

## Flur 2
- Licht: `light.flur_2_flur_2` (alle), `light.flur_2_flur_1`, `light.flur_2_flur_2a`, `light.flur_2_flur_3`
- Reinigung: `vacuum.berta`
- Geräte: `sensor.basisstation_wi_fi_signalstarke`, `switch.berta_dock_kindersicherung`, `sensor.fritz_repeater_6000_betriebszeit`,
  `binary_sensor.ib2707311104_verbindungszustand`, `device_tracker.nas`, `sensor.samsung_c48x_series_black_toner_s_n_crum_16032115075`,
  `binary_sensor.sec8425192d5801_problem`, `device_tracker.samsungc48drucker`, `device_tracker.sbs50_598866`,
  `device_tracker.tadobridgeib2707311104`

## Keller
- Geräte: `sensor.fritz_powerline_540e_betriebszeit`, `device_tracker.lg_smart_laundry2_open`

## Sonstiges (ohne Raum)
- Medien: `media_player.saschas_echo_dot`, `media_player.soundsystem`, `media_player.wohnung`, `media_player.uberall`, `switch.svens_fire_tv_bitte_nicht_storen`
- Sicherheit: `binary_sensor.rauchmelder_alarmstatus`, `binary_sensor.rauchmelder_2_alarmstatus`,
  `binary_sensor.heat_alarm_sbs5015598866_00000001_end_of_life`, `binary_sensor.heat_alarm_sbs5015598866_00000005_end_of_life`,
  `binary_sensor.smoke_alarm_sbs5015598866_00000002_end_of_life`, `binary_sensor.smoke_alarm_sbs5015598866_00000003_smoke_fault_status`
- Wetter/System: `weather.forecast_home`, `sensor.sun_next_dawn`, `sensor.stadt_geretsried_aktuelle_warnstufe`, `sensor.backup_backup_manager_state`

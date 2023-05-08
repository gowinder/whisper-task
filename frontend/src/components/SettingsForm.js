import React, { useEffect, useState } from 'react';
import { TextField, Switch, FormControlLabel, Button, Checkbox, InputLabel, MenuItem, Select, Box, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings, setSettingsData } from '../store/settingsSlice';
import { CheckBox } from '@mui/icons-material';


const LANGUAGES = {
    "en": "english",
    "zh": "chinese",
    "de": "german",
    "es": "spanish",
    "ru": "russian",
    "ko": "korean",
    "fr": "french",
    "ja": "japanese",
    "pt": "portuguese",
    "tr": "turkish",
    "pl": "polish",
    "ca": "catalan",
    "nl": "dutch",
    "ar": "arabic",
    "sv": "swedish",
    "it": "italian",
    "id": "indonesian",
    "hi": "hindi",
    "fi": "finnish",
    "vi": "vietnamese",
    "he": "hebrew",
    "uk": "ukrainian",
    "el": "greek",
    "ms": "malay",
    "cs": "czech",
    "ro": "romanian",
    "da": "danish",
    "hu": "hungarian",
    "ta": "tamil",
    "no": "norwegian",
    "th": "thai",
    "ur": "urdu",
    "hr": "croatian",
    "bg": "bulgarian",
    "lt": "lithuanian",
    "la": "latin",
    "mi": "maori",
    "ml": "malayalam",
    "cy": "welsh",
    "sk": "slovak",
    "te": "telugu",
    "fa": "persian",
    "lv": "latvian",
    "bn": "bengali",
    "sr": "serbian",
    "az": "azerbaijani",
    "sl": "slovenian",
    "kn": "kannada",
    "et": "estonian",
    "mk": "macedonian",
    "br": "breton",
    "eu": "basque",
    "is": "icelandic",
    "hy": "armenian",
    "ne": "nepali",
    "mn": "mongolian",
    "bs": "bosnian",
    "kk": "kazakh",
    "sq": "albanian",
    "sw": "swahili",
    "gl": "galician",
    "mr": "marathi",
    "pa": "punjabi",
    "si": "sinhala",
    "km": "khmer",
    "sn": "shona",
    "yo": "yoruba",
    "so": "somali",
    "af": "afrikaans",
    "oc": "occitan",
    "ka": "georgian",
    "be": "belarusian",
    "tg": "tajik",
    "sd": "sindhi",
    "gu": "gujarati",
    "am": "amharic",
    "yi": "yiddish",
    "lo": "lao",
    "uz": "uzbek",
    "fo": "faroese",
    "ht": "haitian creole",
    "ps": "pashto",
    "tk": "turkmen",
    "nn": "nynorsk",
    "mt": "maltese",
    "sa": "sanskrit",
    "lb": "luxembourgish",
    "my": "myanmar",
    "bo": "tibetan",
    "tl": "tagalog",
    "mg": "malagasy",
    "as": "assamese",
    "tt": "tatar",
    "haw": "hawaiian",
    "ln": "lingala",
    "ha": "hausa",
    "ba": "bashkir",
    "jw": "javanese",
    "su": "sundanese",
};

const LANGUAGE_FULL = [
    '',
    'english',        'chinese',     'german',        'spanish',
    'russian',        'korean',      'french',        'japanese',
    'portuguese',     'turkish',     'polish',        'catalan',
    'dutch',          'arabic',      'swedish',       'italian',
    'indonesian',     'hindi',       'finnish',       'vietnamese',
    'hebrew',         'ukrainian',   'greek',         'malay',
    'czech',          'romanian',    'danish',        'hungarian',
    'tamil',          'norwegian',   'thai',          'urdu',
    'croatian',       'bulgarian',   'lithuanian',    'latin',
    'maori',          'malayalam',   'welsh',         'slovak',
    'telugu',         'persian',     'latvian',       'bengali',
    'serbian',        'azerbaijani', 'slovenian',     'kannada',
    'estonian',       'macedonian',  'breton',        'basque',
    'icelandic',      'armenian',    'nepali',        'mongolian',
    'bosnian',        'kazakh',      'albanian',      'swahili',
    'galician',       'marathi',     'punjabi',       'sinhala',
    'khmer',          'shona',       'yoruba',        'somali',
    'afrikaans',      'occitan',     'georgian',      'belarusian',
    'tajik',          'sindhi',      'gujarati',      'amharic',
    'yiddish',        'lao',         'uzbek',         'faroese',
    'haitian creole', 'pashto',      'turkmen',       'nynorsk',
    'maltese',        'sanskrit',    'luxembourgish', 'myanmar',
    'tibetan',        'tagalog',     'malagasy',      'assamese',
    'tatar',          'hawaiian',    'lingala',       'hausa',
    'bashkir',        'javanese',    'sundanese'
  
]

const EXTENSIONS = [
  { value: '.mp4', label: '.mp4' },
  { value: '.mkv', label: '.mkv' },
  { value: '.avi', label: '.avi' },
];

function SettingsForm() {
    const dispatch = useDispatch();
    const settingsData = useSelector((state) => state.settings.data);
    const fetchStatus = useSelector((state) => state.settings.status);
    const error = useSelector((state) => state.settings.error);
    // const [formState, setFormState] = useState(settingsData);

    useEffect(() => {
      if (fetchStatus === 'idle') {
        dispatch(fetchSettings());
      }
    }, [fetchSettings, fetchStatus, dispatch]);
    
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      // console.log("🚀 ~ file: SettingsForm.js:132 ~ handleChange ~ event.target:", event.target)
      dispatch(setSettingsData({
        ...settingsData,
        [name]: value,
      },
      ));
    };

    const handleRescanChange = (event) => {
      const { checked } = event.target;
      // console.log("🚀 ~ file: SettingsForm.js:171 ~ handleRescanChange ~ checked:", checked)
      // console.log("🚀 ~ file: SettingsForm.js:171 ~ handleRescanChange ~ event:", event)
      dispatch(setSettingsData({
        ...settingsData,
        ['rescan']: checked,
      },
      ));
    };

    const handleIncludeExtsChange = (event) => {
      const { name, value } = event.target;
      // console.log("🚀 ~ file: SettingsForm.js:132 ~ handleIncludeExtsChange ~ target:", event.target)
      const newState = { ...settingsData, include_exts: value}
      dispatch(setSettingsData(newState))
      // dispatch(setSettingsData((prevState) => ({
      //   ...prevState,
      //   include_exts: value.join(",")
      // })));
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      dispatch(updateSettings(settingsData));
    };
    
    console.log("🚀 ~ file: SettingsForm.js:260 ~ SettingsForm ~ settingsData:", settingsData)
    // console.log("🚀 ~ file: SettingsForm.js:260 ~ SettingsForm ~ settingsData.root_dir:", settingsData.root_dir)
  
    return (
      (<form onSubmit={handleSubmit}>
      {settingsData.root_dir && (<TextField
        fullWidth
        margin="normal"
        name="root_dir"
        label="Root Directory"
        value={settingsData.root_dir}
        onChange={handleChange}
      />)}

      { settingsData.rescan !== undefined && (<FormControlLabel
        control={
          <Checkbox
            color="primary"
            name="rescan"
            checked={settingsData.rescan}
            onChange={handleRescanChange}
          />
        }
        label="Rescan"
      />) }

      { settingsData.scan_interval && (<TextField
        fullWidth
        margin="normal"
        name="scan_interval"
        label="Scan Interval (seconds)"
        type="number"
        inputProps={{ min: 60, max: 604800 }}
        value={settingsData.scan_interval}
        onChange={handleChange}
      />) }

      { settingsData.scheduler_interval && (<TextField
        fullWidth
        margin="normal"
        name="scheduler_interval"
        label="Scheduler Interval (seconds)"
        type="number"
        inputProps={{ min: 60, max: 604800 }}
        value={settingsData.scheduler_interval}
        onChange={handleChange}
      />) }

      {settingsData.language && (
        <FormControl fullWidth margin="normal">
        <InputLabel>Language</InputLabel>
        <Select
          label="Language"
          name="language"
          value={settingsData.language.toLowerCase()}
          onChange={handleChange}
        >
          {LANGUAGE_FULL.map((value, index) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        )
      }

    { settingsData.task && 
      (<FormControl fullWidth margin="normal">
        <InputLabel>Task</InputLabel>
        <Select
          label="Task"
          name="task"
          value={settingsData.task}
          onChange={handleChange}
        >
          {['translate', 'transcript'].map((task) => (
            <MenuItem key={task} value={task}>
              {task}
            </MenuItem>
          ))}
        </Select>
      </FormControl>)}

    { settingsData.include_exts && 
    (

        <FormControl fullWidth margin="normal">
          <InputLabel>Include Extensions</InputLabel>
          <Select
            label="Include Extensions"
            name="include_exts"
            multiple
            value={settingsData.include_exts}
            onChange={handleIncludeExtsChange}
            renderValue={(selected) =>
              selected.map((value) => {
                const ext = EXTENSIONS.find((ext) => ext.value === value);
                return ext ? ext.label : value;
              }).join(', ')
            }
          >
            {settingsData.include_exts && EXTENSIONS.map((ext) => (
              <MenuItem key={ext.value} value={ext.value}>
                <Checkbox checked={settingsData.include_exts.includes(ext.value)} />
                {ext.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Box mt={2}>
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </Box>
    </form>)
    );
  }

export default SettingsForm;
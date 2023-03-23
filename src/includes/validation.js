import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate' // 这里将原组件名做了修改
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded
} from '@vee-validate/rules'
export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)
    // 规则定义到全局可用
    defineRule('required', required)
    defineRule('tos', required) // only for TOS's error message
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('email', email)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('psw_mismatch', confirmed)
    defineRule('excluded', excluded)
    defineRule('country_excluded', excluded) // only for region validation
    configure({
      // 自定义校验提示文字
      generateMessage: (ctx) => {
        const messages  = {
          required: `The field ${ctx.field} is required.`,
          tos: 'You must accept the terms of Service.',
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          email: `The field ${ctx.field} must be a valid email.`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetical character or space.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}`,
          country_excluded: 'Due to restrictions, we do not accept users from this location.',
          psw_mismatch: 'The password do not match.',
        }
        const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field ${ctx.field} is invalid.`
        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
    })
  }
}

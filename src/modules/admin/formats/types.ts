import type { TypeColumnTypeV1 } from '@/api/__generated__/v1/data-contracts.ts'

export type ColTypeKind = 'string' | 'integer' | 'float' | 'boolean' | 'datetime'

export type ExprLiteralNum = { op: 'num'; value: number }
export type ExprLiteralStr = { op: 'str'; value: string }
export type ExprLiteralBool = { op: 'bool'; value: boolean }
export type ExprLiteralNull = { op: 'null' }
export type ExprVar = { op: 'var'; field: string }

export type ArithmeticOp = '+' | '-' | '*' | '/'
export type ComparisonOp = '>' | '>=' | '<' | '<=' | '==' | '!='
export type BinaryOp = ArithmeticOp | ComparisonOp

export type ExprBinary = { op: BinaryOp; args: [Expr, Expr] }
export type ExprAndOr = { op: 'and' | 'or'; args: Expr[] }
export type ExprNot = { op: '!'; arg: Expr }
export type ExprIf = { op: 'if'; cond: Expr; then: Expr; else: Expr }
export type ExprIn = { op: 'in'; value: Expr; items: Expr[] }
export type ExprConcat = { op: 'concat'; args: Expr[] }
export type ExprRound = { op: 'round'; value: Expr; decimals: Expr }

export type Expr =
  | ExprLiteralNum
  | ExprLiteralStr
  | ExprLiteralBool
  | ExprLiteralNull
  | ExprVar
  | ExprBinary
  | ExprAndOr
  | ExprNot
  | ExprIf
  | ExprIn
  | ExprConcat
  | ExprRound

export type OpKind = Expr['op']

export const OP_GROUPS: Array<{ label: string; ops: OpKind[] }> = [
  { label: 'Literals', ops: ['num', 'str', 'bool', 'null'] },
  { label: 'Field', ops: ['var'] },
  { label: 'Arithmetic', ops: ['+', '-', '*', '/', 'round'] },
  { label: 'Comparison', ops: ['>', '>=', '<', '<=', '==', '!='] },
  { label: 'Logic', ops: ['and', 'or', '!', 'if'] },
  { label: 'Sets', ops: ['in'] },
  { label: 'Strings', ops: ['concat'] },
]

export const OP_LABELS: Record<OpKind, string> = {
  num: 'Number',
  str: 'String',
  bool: 'Boolean',
  null: 'Null',
  var: 'Field',
  '+': '+ (add)',
  '-': '- (subtract)',
  '*': '× (multiply)',
  '/': '÷ (divide)',
  '>': '> (greater)',
  '>=': '≥ (greater or equal)',
  '<': '< (less)',
  '<=': '≤ (less or equal)',
  '==': '= (equals)',
  '!=': '≠ (not equals)',
  and: 'AND',
  or: 'OR',
  '!': 'NOT',
  if: 'IF / THEN / ELSE',
  in: 'IN list',
  concat: 'Concatenate',
  round: 'Round',
}

export const ARITHMETIC_OPS: ReadonlySet<OpKind> = new Set([
  '+',
  '-',
  '*',
  '/',
  'round',
])

export const CONCAT_OPS: ReadonlySet<OpKind> = new Set(['concat'])

export const FILTER_COMPARISON_OPS: ComparisonOp[] = [
  '>',
  '>=',
  '<',
  '<=',
  '==',
  '!=',
]

export const FILTER_OP_LABELS: Record<ComparisonOp, string> = {
  '>': 'greater than',
  '>=': 'greater or equal',
  '<': 'less than',
  '<=': 'less or equal',
  '==': 'equals',
  '!=': 'not equals',
}

export function getColKind(colType: TypeColumnTypeV1 | undefined): ColTypeKind {
  return (colType?.kind ?? 'string') as ColTypeKind
}

export function defaultLiteralExprForColType(
  colType: TypeColumnTypeV1 | undefined,
): Expr {
  switch (getColKind(colType)) {
    case 'string':
    case 'datetime':
      return { op: 'str', value: '' }
    case 'integer':
    case 'float':
      return { op: 'num', value: 0 }
    case 'boolean':
      return { op: 'bool', value: false }
  }
}

export type Primitive = string | number | boolean | null

export function defaultPrimitiveForColType(
  colType: TypeColumnTypeV1 | undefined,
): Primitive {
  switch (getColKind(colType)) {
    case 'string':
    case 'datetime':
      return ''
    case 'integer':
    case 'float':
      return 0
    case 'boolean':
      return false
  }
}

export function makeFilterCondition(
  field: string,
  op: ComparisonOp,
  valueExpr: Expr,
): ExprBinary {
  return { op, args: [{ op: 'var', field }, valueExpr] }
}

export function readFilterCondition(expr: Expr): {
  field: string
  op: ComparisonOp
  valueExpr: Expr
} | null {
  if (
    'args' in expr &&
    expr.args.length === 2 &&
    (FILTER_COMPARISON_OPS as string[]).includes(expr.op) &&
    expr.args[0].op === 'var'
  ) {
    return {
      field: expr.args[0].field,
      op: expr.op as ComparisonOp,
      valueExpr: expr.args[1],
    }
  }
  return null
}

export const MAX_DEPTH = 20
export const MAX_NODES = 100

export function makeDefaultExpr(op: OpKind): Expr {
  switch (op) {
    case 'num':
      return { op: 'num', value: 0 }
    case 'str':
      return { op: 'str', value: '' }
    case 'bool':
      return { op: 'bool', value: false }
    case 'null':
      return { op: 'null' }
    case 'var':
      return { op: 'var', field: '' }
    case '+':
    case '-':
    case '*':
    case '/':
    case '>':
    case '>=':
    case '<':
    case '<=':
    case '==':
    case '!=':
      return { op, args: [{ op: 'num', value: 0 }, { op: 'num', value: 0 }] }
    case 'and':
    case 'or':
      return {
        op,
        args: [
          { op: 'bool', value: true },
          { op: 'bool', value: true },
        ],
      }
    case '!':
      return { op: '!', arg: { op: 'bool', value: false } }
    case 'if':
      return {
        op: 'if',
        cond: { op: 'bool', value: true },
        then: { op: 'num', value: 0 },
        else: { op: 'num', value: 0 },
      }
    case 'in':
      return {
        op: 'in',
        value: { op: 'str', value: '' },
        items: [{ op: 'str', value: '' }],
      }
    case 'concat':
      return {
        op: 'concat',
        args: [{ op: 'str', value: '' }, { op: 'str', value: '' }],
      }
    case 'round':
      return {
        op: 'round',
        value: { op: 'num', value: 0 },
        decimals: { op: 'num', value: 0 },
      }
  }
}

export function countNodes(expr: Expr): number {
  switch (expr.op) {
    case 'num':
    case 'str':
    case 'bool':
    case 'null':
    case 'var':
      return 1
    case '+':
    case '-':
    case '*':
    case '/':
    case '>':
    case '>=':
    case '<':
    case '<=':
    case '==':
    case '!=':
      return 1 + countNodes(expr.args[0]) + countNodes(expr.args[1])
    case 'and':
    case 'or':
    case 'concat':
      return 1 + expr.args.reduce((sum, a) => sum + countNodes(a), 0)
    case '!':
      return 1 + countNodes(expr.arg)
    case 'if':
      return 1 + countNodes(expr.cond) + countNodes(expr.then) + countNodes(expr.else)
    case 'in':
      return (
        1 + countNodes(expr.value) + expr.items.reduce((sum, a) => sum + countNodes(a), 0)
      )
    case 'round':
      return 1 + countNodes(expr.value) + countNodes(expr.decimals)
  }
}

export function maxDepth(expr: Expr): number {
  switch (expr.op) {
    case 'num':
    case 'str':
    case 'bool':
    case 'null':
    case 'var':
      return 1
    case '+':
    case '-':
    case '*':
    case '/':
    case '>':
    case '>=':
    case '<':
    case '<=':
    case '==':
    case '!=':
      return 1 + Math.max(maxDepth(expr.args[0]), maxDepth(expr.args[1]))
    case 'and':
    case 'or':
    case 'concat':
      return 1 + Math.max(...expr.args.map(maxDepth))
    case '!':
      return 1 + maxDepth(expr.arg)
    case 'if':
      return 1 + Math.max(maxDepth(expr.cond), maxDepth(expr.then), maxDepth(expr.else))
    case 'in':
      return 1 + Math.max(maxDepth(expr.value), ...expr.items.map(maxDepth))
    case 'round':
      return 1 + Math.max(maxDepth(expr.value), maxDepth(expr.decimals))
  }
}

export function exprIsValid(expr: Expr): boolean {
  if (countNodes(expr) > MAX_NODES) return false
  if (maxDepth(expr) > MAX_DEPTH) return false
  return walkValid(expr)
}

function walkValid(expr: Expr): boolean {
  switch (expr.op) {
    case 'var':
      return expr.field.trim().length > 0
    case 'and':
    case 'or':
      return expr.args.length >= 2 && expr.args.every(walkValid)
    case 'in':
      return expr.items.length >= 1 && walkValid(expr.value) && expr.items.every(walkValid)
    case 'concat':
      return expr.args.length >= 2 && expr.args.every(walkValid)
    case 'if':
      return walkValid(expr.cond) && walkValid(expr.then) && walkValid(expr.else)
    case '!':
      return walkValid(expr.arg)
    case 'round':
      return walkValid(expr.value) && walkValid(expr.decimals)
    case '+':
    case '-':
    case '*':
    case '/':
    case '>':
    case '>=':
    case '<':
    case '<=':
    case '==':
    case '!=':
      return walkValid(expr.args[0]) && walkValid(expr.args[1])
    default:
      return true
  }
}

export function forbiddenOpsForColType(colType: TypeColumnTypeV1 | undefined): Set<OpKind> {
  const kind = colType?.kind ?? 'string'
  switch (kind) {
    case 'string':
      return new Set(ARITHMETIC_OPS)
    case 'integer':
    case 'float':
      return new Set(CONCAT_OPS)
    case 'boolean':
    case 'datetime':
      return new Set([...ARITHMETIC_OPS, ...CONCAT_OPS])
  }
}

export function exprUsesForbiddenOps(expr: Expr, forbidden: Set<OpKind>): boolean {
  if (forbidden.has(expr.op)) return true
  switch (expr.op) {
    case 'and':
    case 'or':
    case 'concat':
      return expr.args.some((a) => exprUsesForbiddenOps(a, forbidden))
    case '+':
    case '-':
    case '*':
    case '/':
    case '>':
    case '>=':
    case '<':
    case '<=':
    case '==':
    case '!=':
      return (
        exprUsesForbiddenOps(expr.args[0], forbidden) ||
        exprUsesForbiddenOps(expr.args[1], forbidden)
      )
    case '!':
      return exprUsesForbiddenOps(expr.arg, forbidden)
    case 'if':
      return (
        exprUsesForbiddenOps(expr.cond, forbidden) ||
        exprUsesForbiddenOps(expr.then, forbidden) ||
        exprUsesForbiddenOps(expr.else, forbidden)
      )
    case 'in':
      return (
        exprUsesForbiddenOps(expr.value, forbidden) ||
        expr.items.some((a) => exprUsesForbiddenOps(a, forbidden))
      )
    case 'round':
      return (
        exprUsesForbiddenOps(expr.value, forbidden) ||
        exprUsesForbiddenOps(expr.decimals, forbidden)
      )
    default:
      return false
  }
}

export function renderExprText(expr: Expr): string {
  switch (expr.op) {
    case 'num':
      return String(expr.value)
    case 'str':
      return JSON.stringify(expr.value)
    case 'bool':
      return expr.value ? 'true' : 'false'
    case 'null':
      return 'null'
    case 'var':
      return expr.field || '<field>'
    case '+':
    case '-':
    case '*':
    case '/':
    case '>':
    case '>=':
    case '<':
    case '<=':
    case '==':
    case '!=':
      return `(${renderExprText(expr.args[0])} ${expr.op} ${renderExprText(expr.args[1])})`
    case 'and':
    case 'or':
      return `(${expr.args.map(renderExprText).join(` ${expr.op} `)})`
    case '!':
      return `!(${renderExprText(expr.arg)})`
    case 'if':
      return `if ${renderExprText(expr.cond)} then ${renderExprText(expr.then)} else ${renderExprText(expr.else)}`
    case 'in':
      return `${renderExprText(expr.value)} in [${expr.items.map(renderExprText).join(', ')}]`
    case 'concat':
      return `concat(${expr.args.map(renderExprText).join(', ')})`
    case 'round':
      return `round(${renderExprText(expr.value)}, ${renderExprText(expr.decimals)})`
  }
}

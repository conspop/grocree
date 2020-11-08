let sectionEls = document.querySelectorAll('.ingredientSection')
let amountEls = document.querySelectorAll('.ingredientAmount')
let deleteEls = document.querySelectorAll('.delete')
let addButtonEl = document.getElementById('add-button')
let addIngredientEl = document.getElementById('add-ingredient')
let addAmountEl = document.getElementById('add-amount')
let tableEl = document.getElementById('ingredients-table').getElementsByTagName('tbody')[0]

sectionEls.forEach(e => {
  e.addEventListener('change', updateSection)
})

amountEls.forEach(e => {
  e.addEventListener('change', updateAmount)
})

deleteEls.forEach(e => {
  e.addEventListener('click', removeIngredient)
})

addButtonEl.addEventListener('click', addIngredient)

async function updateSection(e) {
  let list = e.target.dataset.list
  let ingredient = e.target.dataset.ingredient
  let updatedSection = e.target.value
  
  await fetch(`/ingredients/updatesection`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      ingredient: ingredient,
      updatedSection: updatedSection
    })
  }).then(res => res.json())
  e.target.style.color = 'green'
}

async function updateAmount(e) {
  let list = e.target.dataset.list
  let ingredient = e.target.dataset.ingredient
  let updatedAmount = e.target.value
  
  await fetch(`/lists/updateamount`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      list: list,
      ingredient: ingredient,
      updatedAmount: updatedAmount
    })
  }).then(res => res.json())
  e.target.style.color = 'green'
}

async function removeIngredient(e) {
  let list = e.target.dataset.list
  let ingredient = e.target.dataset.ingredient

  await fetch(`/lists/removeingredient`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      list: list,
      ingredient: ingredient
    })
  }).then(res => res.json())
  e.target.parentElement.parentElement.remove()
}

async function addIngredient(e) {
  let ingredient = addIngredientEl.value
  let amount = addAmountEl.value
  let list = addButtonEl.dataset.list

  await fetch(`/lists/addingredient`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      list: list,
      ingredient: ingredient,
      amount: amount
    })
  }).then(res => res.json()).then(data => {
    ingredientId = data.info[0]
    listIngredientId = data.info[1]
    section = data.section || ''
  })
  
  let newRow = tableEl.insertRow()

  newRow.insertAdjacentHTML('beforeend', `<td class='new-delete' data-list=${list} data-ingredient=${listIngredientId}>X</td>`)
  newRow.insertCell().innerText = ingredient
  newRow.insertAdjacentHTML('beforeend', `<td><input data-list=${list} data-ingredient=${ingredientId} class='newIngredientSection' type='text' value=${section}></td>`)
  newRow.insertAdjacentHTML('beforeend', `<td><input data-list=${list} data-ingredient=${listIngredientId} class='newIngredientAmount' type='text' value='${amount}'></td>`)

  document.querySelectorAll('.newIngredientSection').forEach(e => e.addEventListener('click', updateSection))
  document.querySelectorAll('.new-delete').forEach(e => e.addEventListener('click', removeIngredient))

  addIngredientEl.focus()

  addIngredientEl.value = ''
  addAmountEl.value = ''

}
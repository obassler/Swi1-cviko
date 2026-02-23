package com.osu.swi1cviceni.controller;

import com.osu.swi1cviceni.entity.Item;
import com.osu.swi1cviceni.repository.ItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable int id) {
        return itemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Item createItem(@RequestBody Item item) {
        return itemRepository.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable int id, @RequestBody Item updatedItem) {
        return itemRepository.findById(id)
                .map(item -> {
                    item.setName(updatedItem.getName());
                    item.setPrice(updatedItem.getPrice());
                    item.setQuantity(updatedItem.getQuantity());
                    Item saved = itemRepository.save(item);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable int id) {
        if (!itemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        itemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
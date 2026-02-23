package com.osu.swi1cviceni.repository;

import com.osu.swi1cviceni.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
